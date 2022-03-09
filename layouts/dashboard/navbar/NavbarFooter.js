// @mui
import { Stack } from "@mui/material";
// hooks
import useAuth from "../../../hooks/useAuth";
import useCollapseDrawer from "../../../hooks/useCollapseDrawer";

// Navigation
import navConfig from "./NavConfig";
import { NavSectionVertical } from "../../../components/nav-section";
// ----------------------------------------------------------------------

export default function NavbarFooter() {
  const { user } = useAuth();
  const { isCollapse } = useCollapseDrawer();
  return (
    <Stack
      sx={{
        mb: 1,
        mt: 10,
        width: 1,
        textAlign: "center",
        display: "block",
      }}
    >
      <NavSectionVertical
        navConfig={navConfig[0].footer}
        isCollapse={isCollapse}
      />
    </Stack>
  );
}
