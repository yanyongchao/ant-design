/* eslint-disable react/no-array-index-key */
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import { cloneElement } from '../_util/reactNode';
import type { Breakpoint, ScreenMap } from '../_util/responsiveObserve';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import warning from '../_util/warning';
import DescriptionsItem from './Item';
import Row from './Row';

export interface DescriptionsContextProps {
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export const DescriptionsContext = React.createContext<DescriptionsContextProps>({});

const DEFAULT_COLUMN_MAP: Record<Breakpoint, number> = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

function getColumn(column: DescriptionsProps['column'], screens: ScreenMap): number {
  if (typeof column === 'number') {
    return column;
  }

  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }

  return 3;
}

function getFilledItem(
  node: React.ReactElement,
  span: number | undefined,
  rowRestCol: number,
): React.ReactElement {
  let clone = node;

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol,
    });
    warning(
      span === undefined,
      'Descriptions',
      'Sum of column `span` in a line not match `column` of Descriptions.',
    );
  }

  return clone;
}

function getRowSpanIndex(childNodes, span, column) {
  let start = span;
  let idx;
  for (let i = 0; i < childNodes.length; i++) {
    const span: number = (childNodes[i].props?.span as number) || 1;
    start += span;
    if (start === column) {
      idx = i;
      break;
    }
  }
  return idx;
}

function getRows(children: React.ReactNode, column: number) {
  const childNodes = toArray(children).filter(n => n);
  childNodes.forEach((node, index) => {
    const rowSpan: number | undefined = node.props?.rowSpan as number;
    const span: number | undefined = (node.props?.span as number) || 1;
    if (rowSpan > 1) {
      let composeIdx = index + 1;
      for (let i = 1; i < rowSpan; i++) {
        const idx = composeIdx + getRowSpanIndex(childNodes.slice(composeIdx), span, column);
        childNodes[idx] = cloneElement(childNodes[idx], {
          offset: span,
        });
        composeIdx = idx + 1;
      }
    }
  });

  const rows: React.ReactElement[][] = [];

  let tmpRow: React.ReactElement[] = [];
  let rowRestCol = column;

  childNodes.forEach((node, index) => {
    const span: number | undefined = node?.props?.span || 1;
    const offset: number = node?.props?.offset || 0;
    const mergedSpan = span || 1;
    const composedSpan = mergedSpan + offset;

    if (index === childNodes.length - 1) {
      tmpRow.push(getFilledItem(node, span, rowRestCol));
      rows.push(tmpRow);
      return;
    }

    if (composedSpan < rowRestCol) {
      rowRestCol -= composedSpan;
      tmpRow.push(node);
    } else {
      tmpRow.push(getFilledItem(node, mergedSpan, rowRestCol));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
    }
  });

  return rows;
}

export interface DescriptionsProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  bordered?: boolean;
  size?: 'middle' | 'small' | 'default';
  children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  column?: number | Partial<Record<Breakpoint, number>>;
  layout?: 'horizontal' | 'vertical';
  colon?: boolean;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  columns?: any[];
}

const getRows2 = (columns: any[][], children: React.ReactNode) => {
  const rows: React.ReactElement[][] = [];
  const childNodes = toArray(children).filter(n => n);
  let curIdx = 0;
  columns.forEach(column => {
    const tmpRow: React.ReactElement[] = [];

    column.forEach(node => {
      const rowSpan: number = (node?.rowSpan as number) || 1;
      const span: number = (node?.span as number) || 1;
      tmpRow.push(
        cloneElement(childNodes[curIdx++], {
          span,
          rowSpan,
        }),
      );
    });

    rows.push(tmpRow);
  });

  console.log(rows);

  return rows;
};

function Descriptions({
  prefixCls: customizePrefixCls,
  title,
  extra,
  column = DEFAULT_COLUMN_MAP,
  colon = true,
  bordered,
  layout,
  children,
  className,
  style,
  size,
  labelStyle,
  contentStyle,
  columns,
}: DescriptionsProps) {
  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('descriptions', customizePrefixCls);
  const [screens, setScreens] = React.useState<ScreenMap>({});
  const mergedColumn = getColumn(column, screens);
  // Responsive
  React.useEffect(() => {
    const token = ResponsiveObserve.subscribe(newScreens => {
      if (typeof column !== 'object') {
        return;
      }
      setScreens(newScreens);
    });

    return () => {
      ResponsiveObserve.unsubscribe(token);
    };
  }, []);

  // Children
  let rows;
  if (columns) {
    rows = getRows2(columns, children);
  } else {
    rows = getRows(children, mergedColumn);
  }

  const contextValue = React.useMemo(
    () => ({ labelStyle, contentStyle }),
    [labelStyle, contentStyle],
  );

  return (
    <DescriptionsContext.Provider value={contextValue}>
      <div
        className={classNames(
          prefixCls,
          {
            [`${prefixCls}-${size}`]: size && size !== 'default',
            [`${prefixCls}-bordered`]: !!bordered,
            [`${prefixCls}-rtl`]: direction === 'rtl',
          },
          className,
        )}
        style={style}
      >
        {(title || extra) && (
          <div className={`${prefixCls}-header`}>
            {title && <div className={`${prefixCls}-title`}>{title}</div>}
            {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
          </div>
        )}

        <div className={`${prefixCls}-view`}>
          <table>
            <tbody>
              {rows.map((row, index) => (
                <Row
                  key={index}
                  index={index}
                  colon={colon}
                  prefixCls={prefixCls}
                  vertical={layout === 'vertical'}
                  bordered={bordered}
                  row={row}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DescriptionsContext.Provider>
  );
}

Descriptions.Item = DescriptionsItem;

export default Descriptions;
