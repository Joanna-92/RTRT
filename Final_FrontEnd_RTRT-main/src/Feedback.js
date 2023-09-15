import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";

/**
 * @param {PropTypes.InferProps<Feedback.propTypes>} props
 */
const Feedback = ({ open, title, message, handleClose }) => {
  const { typography } = useTheme();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        align="center"
        fontWeight={700}
        fontSize={typography.h5.fontSize}
        pt={8}
      >
        {title}
      </DialogTitle>

      <DialogContent align="center" sx={{ width: 300, mx: "auto", my: 1 }}>
        {message}
      </DialogContent>
      <DialogActions sx={{ pb: 8, justifyContent: "center" }}>
        <Button variant="contained" sx={{ px: 12 }} onClick={handleClose}>
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Feedback.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Feedback;