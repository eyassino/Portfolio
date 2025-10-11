import './App.css';
import * as React from 'react';
import MainPage from './Pages/mainPage';
import AlgorithmsPage from "./Pages/algorithmsPage";
import PromptedPage from "./Pages/promptedPage";
import {useEffect, useRef, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import PropTypes from "prop-types";
import SnackBarWrapper from "./Helper/snackBarWrapper";
import WAVES from "vanta/src/vanta.waves";
import MenuIcon from '@mui/icons-material/Menu';

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
    const [value, setValue] = useState(0);
    const [isMobile] = useState(window.innerWidth <= 768);
    const [typingIsDone, setTypingIsDone] = useState(false);
    const [drawerState, setDrawerState] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setPage('MainPage');
        } else if (newValue === 1) {
            setPage('AlgorithmsPage');
        } else if (newValue === 2) {
            setPage('PromptedPage');
        }
    };

    const renderPage = () => {
        switch (page) {
            case 'MainPage':
                return <MainPage typingIsDone={typingIsDone} setTypingIsDone={setTypingIsDone}/>;
            case 'AlgorithmsPage':
                return <AlgorithmsPage />;
            case 'PromptedPage':
                return <PromptedPage />;
            default:
                return <MainPage typingIsDone={typingIsDone} setTypingIsDone={setTypingIsDone}/>;
        }
    };

    const toggleDrawer = (newOpen) => () => {
        setDrawerState(newOpen);
    };

    const drawerList = (
        <Box
            sx={{
                backgroundColor: "#3e0775",
                height: "100%",
                color: "white"
            }}
            onClick={toggleDrawer(false)}
        >
            <List>
                {['Main Page', 'Algorithm Project', 'Prompted Game'].map((text, index) => (
                    <ListItem
                        sx={{
                            marginBottom: 1 + 'em',
                        }}
                        key={text} disablePadding
                    >
                        <ListItemButton
                            onClick={() => {
                                handleChange(null, index);
                                toggleDrawer(false);
                            }}
                        >
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const [vantaEffect, setVantaEffect] = useState(null)
    const waveRef = useRef(null)
    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(WAVES({
                el: waveRef.current,
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
            <div className="background" ref={waveRef}></div>
               <AppBar className="default-padding" position="static" color="transparent" sx={{ backdropFilter: "blur(10px)" }}>
                    <Toolbar sx={{ justifyContent: "space-between", padding: 0}}>
                        <div style={{ display: "flex"}}>
                            {isMobile ? (
                                <React.Fragment>
                                    <IconButton onClick={toggleDrawer(true)}>{<MenuIcon color="secondary"/>}</IconButton>
                                    <Drawer
                                        open={drawerState}
                                        onClose={toggleDrawer(false)}
                                        sx={{
                                            backdropFilter: "blur(3px)",
                                        }}
                                    >
                                        {drawerList}
                                    </Drawer>
                                </React.Fragment>
                            ) : (
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
                                    aria-label="full width tabs"
                                    variant={isMobile ? "fullWidth" : "standard"}
                                >
                                    <Tab label={isMobile ? "Main" : "Main page"} {...a11yProps(0)} />
                                    <Tab label={isMobile ? "Alg project" : "Algorithm Project"} {...a11yProps(1)} />
                                    <Tab label="Prompted game" {...a11yProps(1)} />
                                </Tabs>
                            )}
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
