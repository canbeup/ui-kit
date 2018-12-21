import React, { Fragment } from 'react';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Select, { components } from 'react-select';
import { mdiHelpCircle, mdiArrowDownDropCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { flatten, getAnyFromArray } from '../objectUtils';
import { isIos } from '../BrowserUtils';
import FormControl from '@material-ui/core/FormControl';

const selectInputStyle = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    minWidth: 0,
    '& div': {
      maxWidth: 'calc(100% - 30px) !important',
    },
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    width: '100%',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  dropdown: {
    position: 'absolute',
    display: 'flex',
    right: 0,
    top: 0,
    maxWidth: 30,
  },
  select: {
    paddingTop: theme.spacing.unit / 2,
    marginTop: isIos() ? -5 : 1,
  },
  dropdownIndicator: {
    padding: '2px !important',
  },
});
const IndicatorsContainer = ({ selectProps, children }) => (
  <div className={selectProps.childrenClasses.dropdown}>{children}</div>
);
const DropdownIndicator = props =>
  components.DropdownIndicator && (
    <components.DropdownIndicator
      {...props}
      className={props.selectProps.childrenClasses.dropdownIndicator}
    >
      <Icon path={mdiArrowDownDropCircle} size={1} />
    </components.DropdownIndicator>
  );

function NoOptionsMessage({ selectProps, innerProps }) {
  return (
    <Typography
      color="textSecondary"
      className={selectProps.childrenClasses.noOptionsMessage}
      {...innerProps}
    >
      Selecione...
    </Typography>
  );
}

function inputComponentReact({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control({ selectProps, innerRef, innerProps, children }) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent: inputComponentReact,
        inputProps: {
          className: selectProps.childrenClasses.input,
          inputRef: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...selectProps.textFieldProps}
    />
  );
}
const selectMenuHeight = 46;
const optionsShown = 4;

const MenuList = props => {
  const { options, children, getValue } = props;
  const [value] = getValue();

  const initialOffset = Math.max(options.indexOf(value), 0) * selectMenuHeight;
  const listSize = selectMenuHeight * Math.min(optionsShown, options.length);
  return (
    <List
      height={listSize}
      itemCount={options.length}
      itemSize={selectMenuHeight}
      initialScrollOffset={initialOffset} // TODO: tem alguma coisa errada aqui
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

function Option({
  innerRef,
  isFocused,
  innerProps,
  children,
  data,
  isSelected,
}) {
  return (
    <MenuItem
      buttonRef={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
      disabled={data.disabled || false}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
}

const Placeholder = ({ selectProps, innerProps, children }) => (
  <Typography
    component="p"
    className={selectProps.childrenClasses.placeholder}
    {...innerProps}
  >
    {children}
  </Typography>
);

function ValueContainer({ selectProps, children }) {
  return (
    <div className={selectProps.childrenClasses.valueContainer}>{children}</div>
  );
}

const Menu = ({ menuPlacement, theme, selectProps, innerProps, children }) => {
  const style = {
    ...(menuPlacement === 'bottom'
      ? { marginTop: theme.spacing.unit }
      : { bottom: 35 }),
    zIndex: 999999,
    overflow: 'visible',
  };
  return (
    <Paper
      square
      className={selectProps.childrenClasses.paper}
      style={style}
      {...innerProps}
    >
      {children}
    </Paper>
  );
};
const componentsTopInput = {
  Control,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  Menu,
  DropdownIndicator,
  IndicatorsContainer,
  MenuList,
};

export const SelectUIKit = withStyles(selectInputStyle)(
  ({
    value,
    onChange,
    children,
    tooltip,
    label,
    options = [],
    endAdornment,
    classes,
    disabled,
    placeholder,
    name,
    menuPlacement = 'bottom',
    ...rest
  }) => {
    const flattenChildren = childrenIn =>
      childrenIn
        ? flatten(childrenIn)
            .filter(c => !!c && !!c.props)
            .map(suggestion => ({
              value: suggestion.props.value,
              label: suggestion.props.children,
              disabled: suggestion.props.disabled || false,
            }))
        : [];
    const map =
      options !== undefined && options && options.length !== 0
        ? options
        : flattenChildren(children);
    return (
      <FormControl fullWidth>
        <Select
          {...rest}
          value={getAnyFromArray(map.filter(c => c.value === value))}
          isDisabled={disabled}
          onChange={input2 => {
            onChange(input2.value);
          }}
          menuPlacement={menuPlacement}
          options={map}
          className={classes.select}
          childrenClasses={classes}
          components={componentsTopInput}
          placeholder={placeholder || label || ''}
          maxMenuHeight={200}
          textFieldProps={{
            label,
            disabled,
            InputLabelProps: {
              shrink: true,
            },
          }}
          endAdornment={
            <Fragment>
              {endAdornment}
              {tooltip ? (
                <Tooltip title={tooltip} placement="right">
                  <Icon path={mdiHelpCircle} size={1} />
                </Tooltip>
              ) : null}
            </Fragment>
          }
        />
        <FormHelperText>Aasd</FormHelperText>
      </FormControl>
    );
  }
);
