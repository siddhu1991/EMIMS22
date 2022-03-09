// ----------------------------------------------------------------------

const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', '9', '8'];
const INFO_NAME = ['F', 'G', 'T', 'I', 'J', '1', '2', '3'];
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', '4', '5'];
const WARNING_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7'];
const ERROR_NAME = ['V', 'W', 'X', 'M', 'Z'];

function getFirstCharacter(name) {
  return name && name.charAt(0).toUpperCase();
}

function getFirstTwoCharacter(name) {
  if (name) {
    const fullName = name.split(/(?<=^\S+)\s/);
    let nameLetter = '';
    if (fullName[0] !== undefined) {
      nameLetter += fullName[0].charAt(0).toUpperCase();
    }
    if (fullName[1] !== undefined) {
      nameLetter += fullName[1].replace(/\s/g,'').charAt(0).toUpperCase();
    }

    return nameLetter;
  }
}

function getAvatarColor(name) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return 'primary';
  if (INFO_NAME.includes(getFirstCharacter(name))) return 'info';
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return 'success';
  if (WARNING_NAME.includes(getFirstCharacter(name))) return 'warning';
  if (ERROR_NAME.includes(getFirstCharacter(name))) return 'error';
  return 'default';
}

export default function createAvatar(name) {
  return {
    name: getFirstCharacter(name),
    color: getAvatarColor(name),
  };
}

export function createTwoLetterAvatar(name) {
  return {
    name: getFirstTwoCharacter(name),
    color: getAvatarColor(name),
  };
}