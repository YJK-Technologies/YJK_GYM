export const getPermission = (screenType: string) => {
  const permissions = JSON.parse(
    sessionStorage.getItem("permissions") || "[]"
  );

  return permissions.find(
    (item: any) =>
      item.screen_type?.toLowerCase() === screenType.toLowerCase()
  );
};

export const hasActionPermission = (
  screenType: string,
  action: string
) => {
  const permission = getPermission(screenType);

  if (!permission) return false;

  const permissionType = (permission.permission_type || "")
    .toLowerCase()
    .trim();

  // Full access
  if (permissionType === "all permission") {
    return true;
  }

  // Support comma separated values
  const actions = permissionType
    .split(",")
    .map((x: string) => x.trim());

  return actions.includes(action.toLowerCase());
};