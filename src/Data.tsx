import React, { useState } from 'react';

type DataType =
  | 'number'
  | 'boolean'
  | 'date'
  | 'text'
  | 'textarea'
  | 'object'
  | 'function'
  | 'array'
  | 'set'
  | 'map';

function getType(value: any): DataType {
  let type = typeof value;
  switch (type) {
    case 'number':
    case 'function':
    case 'boolean':
      return type;
    case 'string':
      return value.length < 20 ? 'text' : 'textarea';
    case 'object':
      if (Array.isArray(value)) {
        return 'array';
      }
      if (value instanceof Date) {
        return 'date';
      }
      if (value instanceof Map) {
        return 'map';
      }
      if (value instanceof Set) {
        return 'set';
      }
      return type;
    case 'undefined':
      return 'text';
    default:
      return 'text';
  }
}

function newUniqueItem<T>(sample: T, exist: (item: T) => boolean) {
  let value = newItem(sample);
  for (;;) {
    if (!exist(value)) {
      return value;
    }
    if (typeof value === 'number') {
      value++;
    } else if (typeof value === 'string') {
      value += 'x';
    }
  }
}

function newItem(sample: any) {
  if (sample === undefined) {
    return '';
  }
  let type = getType(sample);
  switch (type) {
    case 'number':
      return 0;
    case 'date':
      return new Date();
    case 'text':
    case 'textarea':
      return '';
    case 'object':
      let res = {} as any;
      Object.keys(sample).forEach((name) => {
        let value = sample[name];
        res[name] = (function () {
          if (Array.isArray(value)) {
            return [newItem(value[0])];
          } else if (value instanceof Map) {
            return new Map();
          } else if (value instanceof Set) {
            return new Set();
          } else {
            return newItem(value);
          }
        })();
      });
      return res;
  }
}

export type DataProps = {
  name: PropertyKey;
  state: object & any;
  onChange?: () => void;
  readOnly?: boolean;
  sort?: boolean; // for Map and Set
};

function Data(props: DataProps) {
  const { name, state } = props;
  const value = state[name];
  const type = getType(value);
  switch (type) {
    case 'textarea':
      return TextData(props);
    case 'object':
      return ObjectData(props);
    case 'date':
      return DateData(props);
    case 'array':
      return ArrayData(props);
    case 'set':
      return SetData(props);
    case 'map':
      return MapData(props);
    case 'boolean':
      return BooleanData(props);
    default:
      return InputData(props);
  }
}

function ArrayData(props: DataProps) {
  const { name, state } = props;
  const value = state[name] as Array<any>;
  return (
    <>
      <ol className="array">
        {value.map((x, i) => (
          <li key={i}>
            <Data
              sort={props.sort}
              readOnly={props.readOnly}
              name={i}
              state={value}
              onChange={() => {
                state[name] = state[name];
                props.onChange?.();
              }}
            />
            <button
              hidden={props.readOnly}
              onClick={() => {
                value.splice(i, 1);
                props.onChange?.();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
      <button
        hidden={props.readOnly}
        onClick={() => {
          value.push(newItem(value[0]));
          props.onChange?.();
        }}
      >
        Add
      </button>
    </>
  );
}

function SetData(props: DataProps) {
  const { name, state } = props;
  const set = state[name] as Set<any>;
  let values = Array.from(set);
  if (props.sort) {
    values.sort();
  }
  return (
    <>
      <ul className="set">
        {values.map((x, i) => (
          <li key={i}>
            <Data
              sort={props.sort}
              readOnly={props.readOnly}
              state={
                new Proxy(
                  {},
                  {
                    get() {
                      return x;
                    },
                    set(target: {}, _p: PropertyKey, value: any): boolean {
                      set.delete(x);
                      set.add(value);
                      return true;
                    },
                  },
                )
              }
              name={''}
              onChange={props.onChange}
            />
            <button
              hidden={props.readOnly}
              onClick={() => {
                set.delete(x);
                props.onChange?.();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        hidden={props.readOnly}
        onClick={() => {
          let sample = Array.from(set)[0];
          let value = newUniqueItem(sample, (item) => set.has(item));
          set.add(value);
          props.onChange?.();
        }}
      >
        Add
      </button>
      <button
        hidden={props.readOnly}
        onClick={() => {
          set.clear();
          props.onChange?.();
        }}
      >
        Clear
      </button>
    </>
  );
}

function MapData(props: DataProps) {
  const { name, state } = props;
  const map = state[name] as Map<any, any>;
  let keys = Array.from(map.keys());
  if (props.sort) {
    keys.sort();
  }
  return (
    <>
      <ul className="map">
        {keys
          .map((key) => [key, map.get(key)])
          .map(([key, val], i) => (
            <li key={i}>
              <Data
                sort={props.sort}
                readOnly={props.readOnly}
                state={
                  new Proxy(
                    {},
                    {
                      get() {
                        return key;
                      },
                      set(target: {}, _p: PropertyKey, newKey: any): boolean {
                        map.delete(key);
                        map.set(newKey, val);
                        return true;
                      },
                    },
                  )
                }
                name={''}
                onChange={props.onChange}
              />
              {'=>'}
              <Data
                sort={props.sort}
                readOnly={props.readOnly}
                state={
                  new Proxy(
                    {},
                    {
                      get() {
                        return val;
                      },
                      set(target: {}, _p: PropertyKey, value: any): boolean {
                        map.set(key, value);
                        return true;
                      },
                    },
                  )
                }
                name={''}
                onChange={props.onChange}
              />
              <button
                hidden={props.readOnly}
                onClick={() => {
                  map.delete(key);
                  props.onChange?.();
                }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
      <button
        hidden={props.readOnly}
        onClick={() => {
          let kv = Array.from(map)[0];
          let key = newUniqueItem(kv?.[0], (item) => map.has(item));
          let value = newItem(kv?.[1]);
          map.set(key, value);
          props.onChange?.();
        }}
      >
        Add
      </button>
      <button
        hidden={props.readOnly}
        onClick={() => {
          map.clear();
          props.onChange?.();
        }}
      >
        Clear
      </button>
    </>
  );
}

function TextData(props: DataProps) {
  const { state, name } = props;
  const value = state[name] as string;
  return (
    <textarea
      readOnly={props.readOnly}
      value={value}
      onChange={(e) => {
        state[name] = e.target.value;
        props.onChange?.();
      }}
    />
  );
}

function ObjectData(props: DataProps) {
  const { state, name } = props;
  const value = state[name];
  return (
    <table className="object">
      <tbody>
        {Object.entries(value).map(([name, val], i) => {
          return (
            <tr key={i}>
              {getType(val) === 'function' ? (
                <FunctionData
                  name={name}
                  readOnly={props.readOnly}
                  state={value}
                />
              ) : (
                <>
                  <td>
                    <label>{name}</label>
                  </td>
                  <td>
                    <Data
                      sort={props.sort}
                      readOnly={props.readOnly}
                      name={name}
                      state={value}
                      onChange={props.onChange}
                    />
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function FunctionData(props: { name: string; readOnly?: boolean; state: any }) {
  const { name, state, readOnly } = props;
  let [argsText, setArgsText] = useState('');
  return (
    <>
      <td className="function">
        <button
          disabled={readOnly}
          onClick={() => {
            let fn = eval(`(function(state,name){
          state[name](${argsText})
        })`);
            fn(state, name);
          }}
        >
          {name}
        </button>
      </td>
      <td className="function">
        <input
          disabled={readOnly}
          value={argsText}
          onChange={(e) => setArgsText(e.target.value)}
        />
      </td>
    </>
  );
}

function d2(x: number) {
  return (x < 10 ? '0' : '') + x;
}

function DateData(props: DataProps) {
  const { state, name } = props;
  const value = state[name] as Date;
  const date = [value.getFullYear(), value.getMonth() + 1, value.getDate()]
    .map(d2)
    .join('-');
  const time = [value.getHours(), value.getMinutes(), value.getSeconds()]
    .map(d2)
    .join(':');
  return (
    <>
      <input
        readOnly={props.readOnly}
        type="date"
        value={date}
        onChange={(e) => {
          const d = new Date(e.target.value);
          value.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
          props.onChange?.();
        }}
      />
      <input
        readOnly={props.readOnly}
        type="time"
        value={time}
        onChange={(e) => {
          let ss = e.target.value.split(':');
          if (ss.length === 3) {
            value.setHours(+ss[0], +ss[1], +ss[2], 0);
          } else {
            value.setHours(0, 0, 0, 0);
          }
          props.onChange?.();
        }}
      />
    </>
  );
}

function BooleanData(props: DataProps) {
  const { state, name } = props;
  const value = state[name];
  return (
    <>
      <input
        readOnly={props.readOnly}
        type="checkbox"
        value={value}
        onChange={(e) => {
          state[name] = e.target.checked;
          props.onChange?.();
        }}
      />
    </>
  );
}

function InputData(props: DataProps) {
  const { state, name } = props;
  const value = state[name];
  let type = getType(value);
  return (
    <>
      <input
        readOnly={props.readOnly}
        type={type}
        value={value}
        onChange={(e) => {
          state[name] = (function () {
            switch (type) {
              case 'number':
                return e.target.valueAsNumber;
              case 'date':
                return e.target.valueAsDate;
              default:
                return e.target.value;
            }
          })();
          props.onChange?.();
        }}
      />
    </>
  );
}

export default Data;
