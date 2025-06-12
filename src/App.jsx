// we have used below:
//npm i @faker-js/faker
//npm i react-datepicker
//npm i react-leaflet leaflet
//npm install json-server
//npm install react-router-dom

//user authentication in react works in 3 steps:
//1. Get the user emails and password, from a login form and check with an api endpoint if the pwd for user is correct
//2. If the credentials are correct -> we redirect user to main application and we save user object in our state
//3. we need to protect the application fromunauthorised access--> from users who are not currently logged in

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./Context/CititesContext";
import { AuthProvider } from "./Context/FakeAuthContext";

function App() {
  return (
    <AuthProvider>
      {" "}
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage></HomePage>} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login></Login>} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="app" element={<AppLayout />}>
              {/* For nested routes */}
              {/*
                 How to display one component inside another component---> Outlet is used. <Outlet/> is similar to {children} prop.
          ***  <Outlet /> is a React Router component used to render child routes in nested routing.
           *** When you define a parent route that has nested child routes, the parent needs to render an <Outlet /> component as a placeholder where the child route will be displayed.The place where the <Outlet /> is called there these above child routes are rendered.
----------------------------------------------------------------------------------------------------------
             "index" route is one of the default child route i.e going to be  matched if none of these other route matches. While using index we dont need path as it is going to be default element.
            */}
              {/* <Route
              index
              element={<CityList cities={cities} isLoading={isLoading} />}
            /> */}
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              {/* To use  params with React Router -->1.) We create the new Route , we link to that Route and then in that Route we read the state from the URL */}
              {/* whenever URL takes this shape i.e "cities/:id" then it will render City component. */}
              {/* 2.) Go to CityItem.jsx where there is Link tag--> where we are passing the id associated to specidic city */}
              {/* 3.) City component -->useParams hook in order to get data from URL--->read the data from the URL. */}
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList></CountryList>} />
              <Route path="form" element={<Form />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
/*
#################################   SOME POINTS   ###########################
npm install react-router-dom

//Routing associates specific part of url to specific component.
//---------------------------------------------------------------------------
2 big ways of defining routes-->traditional approach is to define our route in declarative way, i.e we will use components that react router gives us right in jsx.

//------------------------------------------------------------------------------------



 <Route path="*" element={<PageNotFound />} />    "*" will match all the routes that are not in our application 

//Lets say, on a homepage we want a link to the pricing component ---> ? -->traditionally we can use an anchor tag ---> which will work but that will reload the whole page ---> and also will fire multile requests if seen in n/w tab.


//       The use of anchor tag will cause the multiple requests in network tab if seen 
     <a href="/pricing">Pricing</a> 


//Soln----> is <Link/> tag ---> no single request in n/w tab and also dont reload the page

//-------------------------------------------------------------------------------------------

//Instead of Link tag we use "NavLink" in PageNav---> NavLink will give the "active" class for the currently active page. Used for know which is currently visited page with that active class
//-------------------------------------------------------------------------------------------


##########CSS Modules::



 ***  HOW TO DEFINE GLOBAL CSS IN CSS MODULES file of any specific component

  :global(.test){
    //STYLING here...
  }


  //useParams
  //useSearchParams---> custom hook of react router dom library
  //useNavigate--> custom hook of react router dom library, for Programmatic navigation


  Programmatic navigation --> means tomove to new URL w/o user click on any link

  //CHECKOUT---> reuable Button component and its styling-->There we are dynamically selecting styles for button using  "type"


  we can also Programmatic navigation--> <Navigate/>

  usecase of <Navigate/> is in nested Routes

  we use replace attribute in <Navigate/> to go back in browser---> replace is used to replace current element in history tag
*/
