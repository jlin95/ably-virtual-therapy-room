const UsernamePrompt = ({
  handleOnChange,
  handleSave,
  handleOnKeyPress,
  isButtonDisabled,
  ...rest
}) => (
  <>
    <input
      placeholder="Username..."
      onChange={handleOnChange}
      onKeyPress={handleOnKeyPress}
      {...rest}
    />
    <button type="submit" disabled={isButtonDisabled} onClick={handleSave}>
      Submit
    </button>
  </>
);

export default UsernamePrompt;
