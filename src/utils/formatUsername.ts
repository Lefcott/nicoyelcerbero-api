export const formatUserName = (firstName, lastName) => {
  firstName = firstName.trim();
  firstName = `${firstName[0].toUpperCase()}${firstName
    .substr(1)
    .toLowerCase()}`;
  lastName = lastName.trim();
  lastName = `${lastName[0].toUpperCase()}${lastName.substr(1).toLowerCase()}`;

  const completeName = `${firstName} ${lastName}`;

  return { firstName, lastName, completeName };
};
