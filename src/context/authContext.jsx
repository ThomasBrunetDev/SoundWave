import React, { useState, useContext, useEffect } from 'react';
import { auth, provider, colRef, db} from "../config/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, setDoc, doc } from 'firebase/firestore';



const authContext = React.createContext({
    loginWithGoogle: async () => { },
    logout: () => { },
    user: null,
    isLoading: true,
    v_: 0,
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);



    const loginWithGoogle = async () => {
        try {
            await signOut(auth);
            const result = await signInWithPopup(auth, provider);
            const userDocRef = collection(db, 'users');

            const querySnapshot = await getDocs(userDocRef);
            let existingUser;

            for (const doc of querySnapshot.docs) {
                const userData = doc.data();
                if (userData.uid === result.user.uid) {
                    existingUser = doc;
                    break;
                }
            }

            if (!existingUser) {
                const newUserRef = await addDoc(userDocRef, {
                    uid: result.user.uid,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    chansonsEcoute: [],        // Add these fields with empty arrays
                    likedsongs: [],
                    publicPlaylists: [],
                    playlists: [],
                });
                const secondUserRef = doc(db, 'users', result.user.uid);
                await setDoc(secondUserRef, {
                    uid: result.user.uid,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    chansonsEcoute: [],        // Add these fields with empty arrays
                    likedsongs: [],
                    publicPlaylists: [],
                    playlists: [],
                });

                // You can also add the collections here if you prefer
                const playlistsRef = collection(db, 'playlists', newUserRef.id);
                const likedsongsRef = collection(db, 'likedsongs', newUserRef.id);
                const publicPlaylistsRef = collection(db, 'publicPlaylists', newUserRef.id);

                await addDoc(playlistsRef, { /* Initial data if needed */ });
                await addDoc(likedsongsRef, { /* Initial data if needed */ });
                await addDoc(publicPlaylistsRef, { /* Initial data if needed */ });

                setUser(result.user);
                console.log('Utilisateur connecté via Google:', result.user);
            } else {

                const playlistsSnapshot = await getDocs(collection(db, 'playlists', existingUser.id));
                const likedsongsSnapshot = await getDocs(collection(db, 'likedsongs', existingUser.id));
                const publicPlaylistsSnapshot = await getDocs(collection(db, 'publicPlaylists', existingUser.id));

                if (playlistsSnapshot.empty) {
                    await addDoc(collection(db, 'playlists', existingUser.id));
                }
                if (likedsongsSnapshot.empty) {
                    await addDoc(collection(db, 'likedsongs', existingUser.id));
                }
                if (publicPlaylistsSnapshot.empty) {
                    await addDoc(collection(db, 'publicPlaylists', existingUser.id));
                }

                setUser(result.user);
                console.log('Utilisateur connecté via Google:', result.user);
            }
        } catch (error) {
            console.error('Erreur de connexion Google:', error.message);
        }
    };

    const logout = () => {
        try {
            signOut(auth);
            setUser(null);
            localStorage.removeItem("email");
            console.log("Utilisateur déconnecté");
        } catch (error) {
            console.error("Erreur lors de la déconnexion : ", error);
        }
    };

    return (
        <authContext.Provider value={{ v_: 1, loginWithGoogle, logout, user, isLoading }}>
            {children}
        </authContext.Provider>
    );
};

const useInfos = () => {
    const context = useContext(authContext);
    if (context._v === 0) {
        console.error('Le contexte est consommé depuis l\'extérieur du provider');
    }
    return context;
};

export { AuthProvider, authContext, useInfos };
