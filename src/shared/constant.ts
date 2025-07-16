export const userRole = {
  superAdmin: "superAdmin",
  installer: "installer",
  admin: "admin",
  user: "user",
  public: "public",
  businessAdmin: "businessAdmin",
};

export const userRoleFormate = {
  installer: "Installer",
  admin: "Site Admin",
  businessAdmin: "Business Admin",
  user: "Site User",
  public: "Public User",
  superAdmin: "Super Admin",
};

export const ImageSchema = {
  uid: String,
  name: String,
  status: String,
  url: String,
  size: Number,
};

// transactions
export const transactionsTypesObj = {
  income: "income",
  expense: "expense",
  give: "give",
  take: "take",
  save: "save",
  withdraw: "withdraw",
};

export const transactionsTypes = Object.keys(transactionsTypesObj);


// todos
export const todosPriorityObj = {
  low: "low",
  medium: "medium",
  high: "high",
};

export const todosPriorities = Object.keys(todosPriorityObj);


// routines
export const dayConstantsObj = {
  sunday: "sunday",
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
};

export const dayConstants = Object.keys(dayConstantsObj);
