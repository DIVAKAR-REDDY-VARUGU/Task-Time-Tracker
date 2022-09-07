import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [tasks,setTasks]=useState([])
  const [inputTask,setInputTask]=useState({
    open:false,
    alertMsg:false,
    bg:0,
  })

  
  const exitInputTask=()=>{setInputTask((pre)=>({...pre,open:false,alertMsg:false,bg:pre.bg+1}))}
  const clickedAddTask=()=>{setInputTask((pre)=>({...pre,open:true,alertMsg:false}))}
  
  const addTask=e=>{
    e.preventDefault();
    setInputTask((pre)=>({...pre,bg:pre.bg+1}))
    let min = Number(e.target.MinDur.value),sec = Number(e.target.SecDur.value),check = e.target.noFixedDuration.checked;
    if(min==0&&sec==0&&!check){
      setInputTask((pre)=>({...pre,alertMsg:true}))
      return
    }
    let obj = {
      start: Date.now(),
      TaskName:e.target.TaskTitle.value,
      targetMin: min,
      targerSec: sec,
      remMin:min,
      remSec:sec,
      trackTime: check,
      alertMin: e.target.MinAlrt.value,
      alertSec: e.target.SecAlrt.value,
      Alert:false,
      Completed:false,
    };
    if(check){
      obj.minTime=0
      obj.secTime=0
    }
    
    setTasks((pre)=>[...tasks,obj])
    console.log(obj);
    exitInputTask()

  }

  const changeTime=()=>{
    
    setTasks((tasks) =>{
      if(tasks.length==0)return tasks;
  
      let newList = tasks.map((item) => {
        if (item.Completed) return { ...item };
        let milliSeconds = Date.now() - Number(item.start);
        let sec = Math.floor((milliSeconds % (1000 * 60)) / 1000);
        let min = Math.floor((milliSeconds % (1000 * 60 * 60)) / (1000 * 60));
        if(item.trackTime){
          return {...item,minTime:min,secTime:sec}
        }
        milliSeconds=Number((item.targerSec*1000)+(item.targetMin*60*1000))-milliSeconds
        sec = Math.floor((milliSeconds % (1000 * 60)) / 1000);
        min = Math.floor((milliSeconds % (1000 * 60 * 60)) / (1000 * 60));
        
        let Alert =(item.Alert)?true:((min <= 0 && sec <= 10)||(min<=Number(item.alertMin)&&sec<=Number(item.alertSec)))? true : false;
        let Completed = min <= 0 && sec <= 0 ? true : false;
        return { ...item, remMin: min, remSec: sec, Alert, Completed };
      });
      return [...newList]});
  }

  const deleteTask=(id)=>{
    setTasks((tasks)=>{
      let newList=tasks.filter((item)=>{
        return item.start!=id
      })
      return [...newList]
    })
  }

  const sortByEnd=()=>{
    setTasks((tasks)=>{
      let newList=tasks.sort((it1,it2)=>{
        return ((it1.remMin*60*1000)+(it1.remSec*1000))-((it2.remMin*60*1000)+(it2.remSec*1000))
      })
      return [...newList]
    })
  }
  
  const sortByStart=()=>{
    setTasks((tasks)=>{
       let newList=tasks.sort((it1,it2)=>{
        return it1.start-it2.start
      })
      return [...newList]
    })
  }

  useEffect(()=>{setInterval(changeTime, 1000)},[])

  return (
    <>
      <div className={`black-screen ${!inputTask.open?"displayNone":''}`}>
        <div className={`input-task--wrapper smallFontAndWeight`}>
            <button className=' Exit num' onClick={()=>{exitInputTask()}}> X </button>
            <form onSubmit={(e)=>{addTask(e)}} className='task-form' autoComplete="off">

                <div>
                  <label className={`displayBold smallFont`}>Enter Task : </label>
                  <input type={'text'} required={true} name='TaskTitle'  />
                </div>



                <div className={`displayCenter `}>
                  <label className={`displayBold smallFont width45`}>Duration : </label>

                  <div>
                      <div>
                      Min
                      <input type={'number'} name='MinDur' className='num' />
                    </div>
                    <div className='lessTop'>  
                      Sec 
                      <input type={'number'} name='SecDur' className='num' />
                    </div>
                  </div>
                  
                </div>


                <div className={`displayCenter `}>
                  <label className={`displayBold smallFont width45`}>Alert Before  : </label>
                  <div>
                      <div>
                      Min
                      <input type={'number'} name='MinAlrt' className='num' />
                    </div>
                    <div className='lessTop'>  
                      Sec 
                      <input type={'number'} name='SecAlrt' className='num' />
                    </div>
                  </div>
                </div>



                <div>
                  No Fixed Duration <input type={'checkbox'} name='noFixedDuration' />
                </div>
                
                
                <div className={`alert-msg ${inputTask.alertMsg?"displayBlock":"displayNone"}`}>
                  *** Either You Should Enter Duration Or Click "No Fixed Duration"  ***
                </div>

                <button type='submit' className='submit'> Done </button>
            </form>
          </div>
          
      </div>

      <div className={`body--wrapper bgimg${inputTask.bg%4}`}>
        <div className="topbar--wrapper moreTop" onClick={()=>{sortByStart()}}>
          Sort by Start Time
        </div>

        <div className="topbar--wrapper" onClick={()=>{sortByEnd()}}>
          Sort by End Time
        </div>
        
        <div className='App'>

          
            
          <div className='Tasks--wrapper'>
            {tasks.length==0?
              <div className='Task--container displayCenter displayBold'> No Tasks.... </div>
              :
              tasks.map((item,index,list)=>{
                return (
                  <div className={`Task--container ${item.Alert?"redBg":""}`}>
                    <div className={'Task--content'}>
                      <div className={'TaskTitle'}> {item.TaskName.toUpperCase()}</div>
                      <div className={`Task--content--data`}> 
                        
                        
                        {((item.alertMin||item.alertSec)&&(!item.trackTime))&&<div className={`Time--wrapper `}>
                            Notify At <span className={`num displayBold`}>{item.alertMin?item.alertMin:'0'}</span> Min : <span className={`num displayBold`}>{item.alertSec?item.alertSec:"0"}</span> Sec
                        </div>}
                        {(!item.trackTime)&&
                          <div >
                            <span className={`num displayBold ${item.Alert?"greenFont":""}`}>{item.remMin}</span> Min : <span className={`num displayBold ${item.Alert?"greenFont":""}`}>{item.remSec}</span> Sec
                          </div>
                        }

                        {
                          (item.trackTime)&&<div>
                              <span className={`num displayBold`}>Task UpTime {`  `+item.minTime}</span> Min : <span className={`num displayBold`}>{item.secTime}</span> Sec
                             
                          </div>
                        }
                        
                        
                      </div>
                    </div>
                    <div className={`delete--wrapper`} onClick={()=>{deleteTask(item.start)}}>
                      <i class="fa fa-trash"></i>
                    </div>
                  </div>
                );
            })}
              <button className='AddTask displayBold ' onClick={()=>{clickedAddTask()}}> Add Task</button>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
