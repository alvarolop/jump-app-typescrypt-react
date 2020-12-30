import React, { useState } from 'react';
import { bind } from '../../utils/bind';
import styles from './Home.module.css';
import { sentJump } from '../../infrastructure/postJump';
import { ResponseBack } from '../../domain/ResponseBack';
import { JumpLog } from '../../domain/JumpLog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Jump } from '../../domain/Jump';

const cx = bind(styles);

interface Props {}

export const Home: React.FunctionComponent<Props> = () => {
  const golang = {
    id: '1',
    jump: 'http://golang:8442',
    name: 'Golang',
    img: './golang.png'
  };
  const springboot = {
    id: '2',
    jump: 'http://springboot:8443',
    name: 'Springboot',
    img: './springboot.png'
  };
  const python = {
    id: '3',
    jump: 'http://python:5000',
    name: 'Python',
    img: './python.png'
  };

  const jumps = [golang, springboot, python];
  const jumpLogTest = {
    dateLog: 'test',
    message: JSON.stringify({ code: 1, message: 'test' })
  };

  const [data, setData] = useState(jumps);
  const [calls, setCalls] = useState(1);
  const [callsInterval, setCallsInterval] = useState(1);
  const [callLogs, setCallLogs] = useState([jumpLogTest]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setData(items);
  };

  const sendJumps = async () => {
    const finalJump: Jump = {
      message: 'hello',
      jump_path: '/jump',
      last_path: '/jump',
      jumps: data.map((i) => i.jump)
    };

    const timeout = async (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms * 1000));
    };

    console.log(finalJump.jumps, calls, callsInterval);

    for (let index = 0; index < calls; index++) {
      await timeout(callsInterval);
      const jump: ResponseBack = await sentJump(
        'http://localhost:8442/jump',
        finalJump
      );
      const timeLog = new Date();
      const time = timeLog.getTime();
      const date = new Date(time);
      const item: JumpLog = {
        dateLog: date.toString(),
        message: JSON.stringify(jump)
      };
      setCallLogs([...callLogs, item]);
      console.log(jump);
    }
  };

  const addGoJump = () => {
    const item = { ...golang };
    if (data.length > 0) {
      const newid = parseInt(data[data.length - 1].id) + 1;
      item.id = newid.toString();
      console.log(item);
      setData([...data, item]);
    } else {
      item.id = '1';
      setData([item]);
    }
  };
  const addSpJump = () => {
    const item = { ...springboot };
    if (data.length > 0) {
      const newid = parseInt(data[data.length - 1].id) + 1;
      item.id = newid.toString();
      console.log(item);
      setData([...data, item]);
    } else {
      item.id = '1';
      setData([item]);
    }
  };
  const addPyJump = () => {
    const item = { ...python };
    if (data.length > 0) {
      const newid = parseInt(data[data.length - 1].id) + 1;
      item.id = newid.toString();
      console.log(item);
      setData([...data, item]);
    } else {
      item.id = '1';
      setData([item]);
    }
  };

  const delJump = (index: number) => {
    const tmpJump = [...data];
    tmpJump.splice(index, 1);
    setData(tmpJump);
  };

  return (
    <>
      <div className={cx('jumps')}>
        <div className={cx('jumps-buttons')}>
          <div>
            <h1>Add Jump:</h1>
            <button onClick={addSpJump} className={cx('jumps-buttons-button')}>
              <img
                src={springboot.img}
                alt={springboot.name}
                className={cx('jumps-buttons-button-img')}
              />
            </button>
            <button onClick={addGoJump} className={cx('jumps-buttons-button')}>
              <img
                src={golang.img}
                alt={golang.name}
                className={cx('jumps-buttons-button-img')}
              />
            </button>
            <button onClick={addPyJump} className={cx('jumps-buttons-button')}>
              <img
                src={python.img}
                alt={python.name}
                className={cx('jumps-buttons-button-img')}
              />
            </button>
          </div>
          <div>
            <h1>Calls Retries:</h1>
            <input
              type='number'
              id='calls'
              name='calls'
              required={true}
              placeholder='80'
              onChange={(event) => setCalls(parseInt(event.target.value))}
              value={calls}
              className={cx('jumps-buttons-calls')}
            />
          </div>
          <div>
            <h1>Calls Interval:</h1>
            <input
              type='number'
              id='callsInterval'
              name='callsInterval'
              required={true}
              placeholder='80'
              onChange={(event) =>
                setCallsInterval(parseInt(event.target.value))
              }
              value={callsInterval}
              className={cx('jumps-buttons-calls')}
            />
          </div>
        </div>
        <div className={cx('jumps-box')}>
          <h1>Jumps</h1>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='jumps'>
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {data.map(({ id, name, jump }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <li
                            key={id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className={cx('jumps-box-item')}>
                              <p>
                                {index + 1} - {name}
                              </p>
                              <img
                                onClick={() => delJump(index)}
                                src='./bin.png'
                                alt='bin'
                                className={cx('jumps-box-item-img')}
                              />
                            </div>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className={cx('jumps-actions')}>
          <button onClick={sendJumps} className={cx('jumps-actions-button')}>
            <img
              src='./rocket.png'
              alt='Jump!'
              className={cx('jumps-actions-button-img')}
            />
            <p>- JUMP -</p>
          </button>
        </div>
      </div>
      <div className={cx('logs')}>
        <div className={cx('logs-items')}>
          {callLogs.map(({ message, dateLog }, index) => {
            if (index !== 0) {
              return (
                <p>
                  Jump {index} - {dateLog} - {message}
                </p>
              );
            } else {
              return <></>;
            }
          })}
        </div>
      </div>
    </>
  );
};