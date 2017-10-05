import { IEditChoice, ITableAttribute } from '../../types/ITableAttribute';

import Dropdown from '../Dropdown';
import ExtensionGate from '../ExtensionGate';
import Icon from '../Icon';
import IconBar from '../IconBar';
import {ITableRowAction} from '../Table';
import {Button, IconButton} from '../TooltipControls';
import VisibilityProxy from '../VisibilityProxy';

import { TD, TR } from './MyTable';

import * as I18next from 'i18next';
import * as React from 'react';
import { FormControl, MenuItem, SplitButton } from 'react-bootstrap';

interface ICellProps {
  language: string;
  attribute: ITableAttribute;
  rowId: string;
  data: any;
  rawData: any;
  tableId: string;
  t: I18next.TranslationFunction;
  container: HTMLElement;
  onHighlight: (highlight: boolean) => void;
}

class TableCell extends React.Component<ICellProps, {}> {
  public shouldComponentUpdate(newProps: ICellProps) {
    return this.props.rawData !== newProps.rawData
        || this.props.data !== newProps.data
        || this.props.language !== newProps.language;
  }

  public render(): JSX.Element {
    const { t, attribute, container, data, language, onHighlight,
            rawData, rowId, tableId } = this.props;

    // if a custom renderer was set then rowData is the raw object
    // passed to the table by the user.
    // otherwise rowData is the calculated value of this cell

    if (attribute.customRenderer !== undefined) {
      const attrControl = attribute.customRenderer(rawData, false, t, {
        onHighlight }) || null;
      return attrControl !== null ? (
        <ExtensionGate id={`extension-${rowId}-${attribute.id}`}>
          {attrControl}
        </ExtensionGate>
      ) : null;
    }

    if ((data === undefined) || (data === null)) {
      return <span>{' '}</span>;
    } else if ((attribute.edit.onChangeValue !== undefined) && attribute.edit.inline) {
      if (attribute.edit.choices !== undefined) {
        const choices = attribute.edit.choices();
        const currentChoice = choices.find(choice => choice.text === data);
        const key = currentChoice !== undefined ? currentChoice.key : undefined;
        return (
          <Dropdown id={`dropdown-${tableId}-${attribute.id}`} container={container}>
            <Button
              id={`btn-${tableId}-${attribute.id}`}
              className={`btn-${tableId}-${attribute.id}-${key}`}
              key={key}
              onClick={this.cycle}
              onSelect={this.changeCell}
              tooltip={attribute.description}
            >
            {currentChoice !== undefined ? t(currentChoice.text) : ''}
            </Button>
            <Dropdown.Toggle
              className={`toggle-${tableId}-${attribute.id} `
                       + `toggle-${tableId}-${attribute.id}-${key}`}
            />
            <Dropdown.Menu
              onSelect={this.changeCell}
            >
            {choices.filter(choice => choice.visible !== false).map(this.renderChoice)}
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    } else {
      const cellType = typeof(data);
      if (cellType === 'string') {
        return <span>{data}</span>;
      } else if (cellType === 'boolean') {
        return (
          <IconButton
            className='btn-embed'
            id={`toggle-${rowId}-${attribute.id}`}
            tooltip={attribute.name}
            icon={data ? 'square-check' : 'square-remove'}
            onClick={this.toggle}
          />
        );
      } else if ((cellType === 'object') && (data instanceof Date)) {
        return (
          <span>
            {data !== undefined ? data.toLocaleString(language) : t('Not installed')}
          </span>
        );
      }
    }
    return <span>{data.toString()}</span>;
  }

  private cycle = () => {
    const { attribute, rawData } = this.props;
    attribute.edit.onChangeValue(rawData, undefined);
  }

  private changeCell = (key) => {
    const { attribute, rawData } = this.props;
    attribute.edit.onChangeValue(rawData, key);
  }

  private renderChoice = (choice: IEditChoice): JSX.Element => {
    const { t, attribute, tableId } = this.props;
    return (
      <MenuItem
        eventKey={choice.key}
        key={choice.key}
        className={`option-${tableId}-${attribute.id}-${choice.key}`}
      >
        {t(choice.text)}
      </MenuItem>
    );
  }

  private toggle = () => {
    const { attribute, data, rawData } = this.props;
    const value = data;
    attribute.edit.onChangeValue(rawData, !value);
  }
}

export interface IRowProps {
  t: I18next.TranslationFunction;
  tableId: string;
  data: any;
  rawData: any;
  attributes: ITableAttribute[];
  actions: ITableRowAction[];
  language: string;
  onClick: React.MouseEventHandler<any>;
  selected: boolean;
  highlighted: boolean;
  domRef?: (ref) => void;
  container: HTMLElement;
  initVisible: boolean;
  onHighlight: (rowId: string, highlight: boolean) => void;
}

class TableRow extends React.Component<IRowProps, {}> {

  public shouldComponentUpdate(nextProps: IRowProps) {
    return (this.props.data !== nextProps.data)
      || (this.props.rawData !== nextProps.rawData)
      || (this.props.selected !== nextProps.selected)
      || (this.props.highlighted !== nextProps.highlighted)
      || (this.props.attributes !== nextProps.attributes);
  }

  public render(): JSX.Element {
    const { data, domRef, highlighted, onClick,
            selected } = this.props;

    const classes = ['xtr'];

    if (selected) {
      classes.push('table-selected');
    }
    if (highlighted) {
      classes.push('table-highlighted');
    }

    return (
      <VisibilityProxy
        id={data.__id}
        key={data.__id}
        className={classes.join(' ')}
        onClick={onClick}
        ref={domRef}
        style={{ display: 'table-row' }}

        startVisible={this.props.initVisible}
        container={this.props.container}
        placeholder={this.renderPlaceholder}
        content={this.renderRow}
      />
    );
  }

  private renderPlaceholder = (): React.ReactNode => {
    const { data, domRef } = this.props;
    return (
      <TD>{'\u00A0'}</TD>
    );
  }

  private renderRow = (): React.ReactNode => {
    const { actions, attributes, data, domRef, tableId } = this.props;

    let hasActions = false;
    if (actions !== undefined) {
      const rowActions = actions.filter((action) =>
        (action.singleRowAction === undefined) || action.singleRowAction);
      hasActions = rowActions.length > 0;
    }

    const res = attributes.map(this.renderAttribute);
    if (hasActions) {
      res.push(
        <TD
          style={{ textAlign: 'center' }}
          key='action-cell'
        >
          <IconBar
            id={`${tableId}-${data.__id}-action-icons`}
            group={`${tableId}-action-icons`}
            instanceId={data.__id}
            className='table-actions'
            staticElements={actions}
            collapse={true}
          />
        </TD>);
    }
    return res;
  }

  private renderAttribute = (attribute: ITableAttribute): JSX.Element => {
    const { t, data, rawData, tableId } = this.props;
    return (
      <TD
        className={`table-${tableId} cell-${attribute.id}`}
        key={attribute.id}
      >
        {this.renderCell(attribute, rawData, data[attribute.id], t)}
      </TD>
    );
  }

  private highlight = (highlight: boolean) => {
    const {data, onHighlight} = this.props;
    onHighlight(data.__id, highlight);
  }

  private renderCell(
    attribute: ITableAttribute,
    rawData: any,
    calculatedData: any,
    t: I18next.TranslationFunction): JSX.Element {

    const { container, data, language, tableId } = this.props;

    return (
      <TableCell
        t={t}
        attribute={attribute}
        rawData={rawData}
        data={calculatedData}
        rowId={data.__id}
        tableId={tableId}
        language={language}
        container={container}
        onHighlight={this.highlight}
      />
    );
  }
}

export default TableRow;
