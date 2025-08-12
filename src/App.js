import './App.css';
import * as React from 'react';
import MainPage from './mainPage';
import AlgorithmsPage from "./algorithmsPage";
import {useEffect, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Typography} from "@mui/material";
import PropTypes from "prop-types";
import SnackBarWrapper from "./snackBarWrapper";
import WAVES from "vanta/src/vanta.waves";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function App() {
    const [page, setPage] = useState('Home');
    const [value, setValue] = React.useState(0);
    const [isMobile] = useState(window.innerWidth <= 768);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setPage('MainPage');
        } else if (newValue === 1) {
            setPage('AlgorithmsPage');
        }
    };

    const renderPage = () => {
        switch (page) {
            case 'MainPage':
                return <MainPage />;
            case 'AlgorithmsPage':
                return <AlgorithmsPage />;
            default:
                return <MainPage />;
        }
    };

    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = React.useRef(null)
    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(WAVES({
                el: myRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x220941,
                shininess: 10.00,
                waveHeight: 15.00,
                waveSpeed: 1.00,
                zoom: 1.00,
            }))
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])

    return (
        <div className="main-body">
            <div className="background" ref={myRef}></div>
               <AppBar className="default-padding" position="static">
                    <Toolbar sx={{ justifyContent: "space-between", padding: 0}}>
                        <div style={{ display: "flex"}}>
                            <Tabs
                                sx={{ justifyContent: "space-between"}}
                                value={value}
                                onChange={handleChange}
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: "white"
                                    }
                                }}
                                textColor="inherit"
                                aria-label="full width tabs example"
                                variant={isMobile ? "fullWidth" : "centered"}
                            >
                                <Tab label={isMobile ? "Main" : "Main page"} {...a11yProps(0)} />
                                <Tab label={isMobile ? "Alg project" : "Algorithm Project"} {...a11yProps(1)} />
                            </Tabs>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Button style={{marginRight: 1 + 'em'}} variant="outlined" href="https://www.linkedin.com/in/emil-yassinov-8aa6b21a0/" target="_blank" rel="noopener noreferrer" color="inherit">LinkedIn</Button>
                            <SnackBarWrapper/>
                        </div>
                    </Toolbar>
                </AppBar>
            {renderPage()}
        </div>

    );
}

export default App;
