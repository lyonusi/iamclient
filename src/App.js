import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/login';
import Admin from './components/admin';
import EditUser from './components/edituser';

function App() {
    return (
        <>
            <Router>
                <div>
                    <Switch>
                        <Route
                            exact
                            path='/email-login'
                            render={(props) => <Login {...props} method={`email`} />}
                        />
                        <Route
                            exact
                            path='/login'
                            render={(props) => <Login {...props} method={`username`} />}
                        />
                        <Route exact path='/admin' component={Admin} />
                        <Route
                            exact
                            path='/admin/create'
                            render={(props) => <EditUser {...props} action={`create`} />}
                        />
                        <Route
                            exact
                            path='/admin/update'
                            render={(props) => <EditUser {...props} action={`edit`} />}
                        />
                    </Switch>
                </div>
            </Router>
        </>
    );
}

export default App;
