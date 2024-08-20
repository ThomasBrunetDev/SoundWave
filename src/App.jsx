import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Layout from "./components/layout";
import LayoutAuth from "./components/layoutAuth";
import ListeRecherche from "./components/Recherche/ListeRecherche";
import DetailsMusic from "./components/DetailMusicMobile/DetailsMusicMobile";
import { useInfos } from "./context/authContext";
import { AuthProvider } from "./context/authContext";
import { UserProvider } from "./context/userContext";
import { AudioProvider } from "./lib/audiotim";
import Playlists from "./components/Playlists";
import PlaylistDetail from "./components/PlaylistDetail";
import Community from "./components/Communaute/Community";
import TableauDeBord from "./components/TableauDeBord/TableauDeBord";
import PlaylistPublicDetail from "./components/Communaute/PlaylistPublicDetail";
import Accueil from "./components/Accueil/Accueil";
import DetailsArtiste from "./components/Recherche/DetailsArtiste";
import DetailsAlbum from "./components/Recherche/DetailsAlbum";
import Commentaires from "./components/Communaute/Commentaires";
import DetailsMusicFull from "./components/DetailMusicMobile/DetailsMusicFull";
import ListeLike from "./components/ListeLike";

import "./App.css";
import Connexion from "./components/Auth/Connexion";

const App = () => {
  const { user, isLoading } = useInfos();
  const routesAuth = [
    {
      path: "",
      element: (
        <UserProvider>
          <Layout />
        </UserProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <Navigate
              to='/tableauDeBord'
              replace
            />
          ),
        },
        {
          path: "/accueil",
          element: <Accueil />,
        },
        {
          path: "/recherche",
          element: <ListeRecherche />,
          children: [
            {
              path: ":idMusic",
              element: <DetailsMusic />,
            },
          ],
        },
        {
          path: "/test",
          element: <DetailsArtiste />,
        },
        {
          path: "/testAlbum",
          element: <DetailsAlbum />,
        },
        {
          path: "playlists",
          element: <Playlists />,
          children: [
            {
              path: ":idPlaylist",
              element: <PlaylistDetail />,
            },
            {
              path: "public/:idPlaylist",
              element: <PlaylistPublicDetail />,
            },
          ],
        },
        {
          path: "community",
          element: <Community />,
        },
        {
          path: "tableauDeBord",
          element: <TableauDeBord />,
        },
        {
          path:"favoris",
          element: <ListeLike />
        }
      ],
    },
    {
      path: "*",
      element: (
        <Navigate
          to='/'
          replace
        />
      ),
    },
  ];
  const routesPasAuth = [
    {
      path: "",
      element: (
        <UserProvider>
          <LayoutAuth />
        </UserProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <Navigate
              to='/accueil'
              replace
            />
          ),
        },
        {
          path: "/accueil",
          element: <Accueil />,
        },

        {
          path: "community",
          element: <Community />,
        },
        {
          path: "playlists",
          element: <Playlists />,
          children: [
            {
              path: "public/:idPlaylist",
              element: <PlaylistPublicDetail />,
            },
          ],
        },
      ],
    },
    {
      path: "/connexion",
      element: <Connexion />,
    },
    {
      path: "*",
      element: (
        <Navigate
          to='/'
          replace
        />
      ),
    },
  ];
  if (isLoading) {
    return <p>Chargement...</p>;
  }
  return (
    <AudioProvider>
      <RouterProvider
        router={createBrowserRouter(user ? routesAuth : routesPasAuth)}
      />
    </AudioProvider>
  );
};

export default App;
