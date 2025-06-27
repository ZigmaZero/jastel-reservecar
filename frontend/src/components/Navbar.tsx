import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  showButtons: boolean
}

const Navbar: React.FC<NavbarProps> = ({ showButtons }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        ReserveCar System
      </Typography>
      {showButtons && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/checkin">
            Checkin
          </Button>
          <Button color="inherit" component={RouterLink} to="/checkout">
            Checkout
          </Button>
        </Box>
      )}
    </Toolbar>
  </AppBar>
);

export default Navbar;