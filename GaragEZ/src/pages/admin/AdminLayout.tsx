// src/pages/admin/AdminLayout.tsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemButton } from "@mui/material";

const adminMenu = [
  { path: "/admin/users", label: "회원관리" },
  { path: "/admin/cars", label: "차량관리" },
  { path: "/admin/reservations", label: "예약관리" },
  { path: "/admin/partshop", label: "부품샵 관리" },
];

const drawerWidth = 240;

const AdminLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* 사이드바 */}
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth } }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {adminMenu.map((menu, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component={Link} to={menu.path}>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 메인 콘텐츠 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet /> {/* ✅ 각 서브 페이지가 여기에 렌더링됨 */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
