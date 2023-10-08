// App.js
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import TaskList from './TaskList'; // Import the TaskList component
function App() {
    return (
        <TaskList/>

    );
}

export default App;
