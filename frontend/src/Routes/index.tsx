import React from "react";
import { BrowserRouter, Routes as RDRoute, Route } from 'react-router-dom'
import { RequireAuth } from "../Contexts/Auth/RequireAuth";

import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import Tasks from "../pages/Tasks";

const Routes = () => {
    return (
        <BrowserRouter>
            <RDRoute>
                <Route path='/login' element={<SignIn />} />
                <Route path='tasks/:work_id' element={<RequireAuth><Tasks /></RequireAuth>} />
                <Route path='/works' element={ <RequireAuth><Home /></RequireAuth>} />
            </RDRoute>
        </BrowserRouter>
    )
}

export default Routes;