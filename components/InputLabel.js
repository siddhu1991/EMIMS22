import PropTypes from 'prop-types';
import { styled } from '@mui/system';
//Style
import { LABEL_BOTTOM_SPACING } from '../theme/spacing';

const Label = styled('label')({
  marginBottom: LABEL_BOTTOM_SPACING,
  display: 'inline-block',
  fontWeight: 500,
});

Label.propTypes = {
  children: PropTypes.node,
};
export default function InputLabel({ children, ...other }) {
  return <Label {...other}>{children}</Label>;
}
