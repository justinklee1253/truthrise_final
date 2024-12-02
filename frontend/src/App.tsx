import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AIDetection from './pages/AIDetection';
import SavedArticles from './pages/SavedArticles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-detection" element={<AIDetection />} />
          <Route path="/saved-articles" element={<SavedArticles />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;