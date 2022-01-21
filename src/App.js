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
                            path='/ui/email-login'
                            render={(props) => <Login {...props} method={`email`} />}
                        />
                        <Route
                            exact
                            path='/ui/login'
                            render={(props) => <Login {...props} method={`username`} />}
                        />
                        <Route exact path='/ui/admin' component={Admin} />
                        <Route
                            exact
                            path='/ui/admin/create'
                            render={(props) => <EditUser {...props} action={`create`} />}
                        />
                        <Route
                            exact
                            path='/ui/admin/update'
                            render={(props) => <EditUser {...props} action={`edit`} />}
                        />
                    </Switch>
                </div>
            </Router>
        </>
    );
}

export default App;
