import "bootstrap/dist/css/bootstrap.css";
import buildClient from "./api/build-client";
import Header from "./components/header";

const AppComponent = ({ Component, pageProps,currentUser }) => {
  return (
    <div>
      <Header {...pageProps} currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser}/>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const response = await client.get("/api/users/currentuser");
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,response.data.currentUser);
  }
  return { pageProps, ...response.data };
};

export default AppComponent;
