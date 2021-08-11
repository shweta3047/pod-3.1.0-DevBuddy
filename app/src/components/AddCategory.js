/* global chrome */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import styles from "../components/style/modal.module.css";
import MockData from "../utils/mock";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "35ch",
      display: 'flex',
      flexDirection: 'column',
      alignItem: 'center',
      justifyContent: 'center',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: '25px'
    },
  },
}));

function AddCategory({ ModalState, setGlobal}) {
  const [categoryFound, setCategoryFound] = useState(false)
  const [groupFound, setGroupFound] = useState(false)
  const [category, setCategory] = useState('');
  const [group, setGroup] = useState('');
  const [tabs, setTabs] = useState([])

  const getTabs = () => {
    chrome.tabs.query(
      { windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        const arrTabs = [...tabs];
        setTabs(arrTabs);
      }
    );
  }

  const handleSubmit = (event) => {
    chrome.storage.local.get(['key'], function (result) {
      let storeData = result.key;
      if (storeData === undefined) {
        storeData = [
          {
            name: category,
            groups: [
              {
                name: group,
                tabs: tabs,
              },
            ],
          },
        ];
      } else {
        let category_found = false;
        let group_found = false;
        for (let i = 0; i < storeData.length; i++) {
          if (storeData[i].name === category) {
            category_found = true;
            for (let j = 0; j < storeData[i].groups.length; j++) {
              if (storeData[i].groups[j].name === group) {
                group_found = true
                console.log('group found');
                // storeData[i].groups[j].tabs = [...storeData[i].groups[j].tabs, tabs];
                 for (let k = 0; k < tabs.length; k++) {
                  storeData[i].groups[j].tabs.push(tabs[k]);
                }
              }
            }
  
            if (group_found === false) {
              storeData[i].groups.push({
                name: group,
                tabs: tabs,
              });
            }
          }
        }
  
        if (category_found === false) {
          storeData.push({
            name: category,
            groups: [
              {
                name: group,
                tabs: tabs,
              },
            ],
          });
        }
      }
      
      setGlobal(storeData);
      window.location.reload();
    });

    event.preventDefault();
  };


  const handleClose = () => {
    ModalState(false)
  }

  const classes = useStyles();

  return (
    <div className={styles.modalBackground}>
      <div className={styles.addModalContainer}>
        <div className={styles.body}>
          <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit} onClick={getTabs}>
            <TextField
              value={category}
              id="outlined-primary"
              label="Add new category"
              variant="outlined"
              color="secondary"
              required={true}
              size='small'
              onChange={(e)=>setCategory(e.target.value)}
            />

            <TextField
              value={group}
              id="outlined-secondary"
              label="Add group name"
              variant="outlined"
              color="secondary"
              required={true}
              size='small'
              onChange={(e) => setGroup(e.target.value)}
            />

            {/* <TextField
              value={tabs}
              id="outlined-secondary"
              label="Add group name"
              variant="outlined"
              color="secondary"
              required={true}
              size='small'
              onChange={(e) => setTabs(e.target.value)}
            /> */}

            {/* <TextareaAutosize
              value={tabs}
              name='tabs'
              className={styles.textArea}
              aria-label="maximum height"
              placeholder='Enter your url lists'
              onChange={(e) => setTabs(e.target.value)}
            /> */}

            <div className={styles.modalFooter}>
              <button 
              id={styles.closeBtn}
              onClick={handleClose}
              >
                Close
              </button>
              <button>Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
