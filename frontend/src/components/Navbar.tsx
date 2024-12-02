import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        width: '100%',
        background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)'
      }}
    >
      <Toolbar sx={{ width: '100%', maxWidth: 'lg', margin: '0 auto' }}>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          TruthRise
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/ai-detection"
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            AI Detection
          </Button>
          <SignedIn>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/saved-articles"
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Saved Articles
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                variant="outlined" 
                color="inherit"
                sx={{ 
                  borderColor: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;