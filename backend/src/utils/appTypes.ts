// company auth roles
// generally we need to implement solution to problem:
// one manager with stanowisko_id=0
// many worker roles with multiple stanowisko_id != 0
export enum CompanyRoles {
  manager = "MANAGER",
  worker = "WORKER",
}

// Function to get role by job position ID
const managerId: number = 0;
export const getRoleByPositionId = (positionId: number): CompanyRoles => {
  return positionId === managerId ? CompanyRoles.manager : CompanyRoles.worker; // default -> worker
};

// Example:
// const userRole = getRoleByPosition(2); // "WORKER"
