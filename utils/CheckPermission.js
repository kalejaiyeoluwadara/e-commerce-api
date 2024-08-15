const CustomError = require("../errors");
const CheckPermission = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.Unauthorized("Not authorized to access this route!");
};
module.exports = CheckPermission;
