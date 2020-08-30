import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
    const initialState = {
        CBC: 1,
        PT: 2,
        HA1: 3,
        BMP: 4,
        LP: 5,
    };
    const [patient, setpatient] = useState(null);
    const [view, setview] = useState("insertData");
    const [arr, setarr] = useState(null);
    const [roomData, setroomData] = useState(null);
    const [loading, setloading] = useState(false);
    const roomNumber = useRef();
    const patientNumber = useRef();
    const roomNum = useRef();
    async function handleSubmit(e) {
        e.preventDefault();
        setloading(true);
        if (
            patientNumber.current.value === "" ||
            roomNumber.current.value === ""
        ) {
            alert("Please Enter valid details");
            setloading(false);
            return;
        }
        if (isNaN(patientNumber.current.value)) {
            alert("Please Enter Valid Patient Number");
            setloading(false);
            return;
        }
        if (isNaN(roomNumber.current.value)) {
            alert("Please Enter Valid Room Number Number");
            setloading(false);
            return;
        }
        axios({
            method: "GET",
            url: `https://murmuring-plains-97224.herokuapp.com/room/${roomNumber.current.value}`,
        }).then((res) => {
            if (res.data.data.length === 0) {
                let tempArr = new Array(parseInt(patientNumber.current.value))
                    .fill(0)
                    .map((item, index) => {
                        return {
                            room: roomNumber.current.value,
                            time: null,
                            patientName: null,
                            tests: [],
                            index: index,
                        };
                    });
                setarr(tempArr);
                setpatient(patientNumber.current.value);
                setloading(false);
            } else {
                alert("Please Enter Another Room, Room Already Taken");
                setloading(false);
                return;
            }
        });
    }
    function handleCheckBox(value, isCheck, index) {
        let tempArr = [...arr];
        if (isCheck) {
            tempArr[index].tests.push(value);
        } else {
            const index1 = tempArr[index].tests.indexOf(value);
            tempArr[index].tests.splice(index1, 1);
        }
        setarr(tempArr);
    }
    function handleChange(value, index) {
        let tempArr = [...arr];
        tempArr[index].patientName = value;
        setarr(tempArr);
    }
    function handleConfirm() {
        setloading(true);
        let tempArr = [...arr];
        tempArr.forEach((item, index) => {
            let tempTime = 0;
            if (!item.patientName) {
                alert(`Please Enter A Valid Name of ${index + 1}`);
                return;
            }
            if (item.tests.length === 0) {
                alert(`Please Select a valid test of ${index + 1}`);
                return;
            }
            item.tests.forEach((item) => {
                tempTime += parseInt(initialState[item]);
            });
            item.time = tempTime;
        });
        setarr(tempArr);
        axios({
            method: "post",
            url: "https://murmuring-plains-97224.herokuapp.com/data",
            data: arr,
        }).then((res) => {
            if (res.data.data) {
                alert("Patients Added Successfully");
                setloading(false);
            } else {
                alert("Adding Failed");
                setloading(false);
            }
        });
    }
    function handleGetData() {
        setloading(true);
        axios({
            method: "get",
            url: `https://murmuring-plains-97224.herokuapp.com/room/${roomNum.current.value}`,
        }).then((res) => {
            setroomData(res.data.data);
            setloading(false);
        });
    }
    function changeView(str) {
        if (str === view) {
            return;
        }
        setpatient(null);
        setarr(null);
        setroomData(null);
        setview(str);
    }
    return (
        <div className="container">
            <nav>
                <div className="row justify-content-around">
                    <div className="col text-center">
                        <span
                            className="cursor"
                            onClick={() => {
                                changeView("insertData");
                            }}
                        >
                            Insert Data
                        </span>
                    </div>
                    <div className="col text-center">
                        <span
                            className="cursor"
                            onClick={() => {
                                changeView("checkData");
                            }}
                        >
                            Check The Data
                        </span>
                    </div>
                </div>
            </nav>
            <br />
            {view === "insertData" && (
                <>
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <div className="row">
                            <div className="col">
                                <label htmlFor="">
                                    Please Enter the Room Number
                                </label>
                                <input
                                    ref={roomNumber}
                                    className="form-control"
                                    type="text"
                                    name=""
                                />
                                <label htmlFor="">
                                    Please Enter the Number Of Patient
                                </label>
                                <input
                                    ref={patientNumber}
                                    className="form-control"
                                    type="text"
                                    name=""
                                />
                                <button
                                    className="btn-block btn-primary mt-3"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Please Wait..." : "OK"}
                                </button>
                            </div>
                        </div>
                    </form>
                    {patient &&
                        arr.map((item, index) => {
                            return (
                                <div key={index}>
                                    <label
                                        htmlFor=""
                                        className="mt-4 font-weight-bold"
                                    >
                                        Enter Patient Name {`${index + 1}`}
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name=""
                                        onChange={(e) => {
                                            handleChange(e.target.value, index);
                                        }}
                                    />
                                    <div>
                                        <label htmlFor="">
                                            Please Check The Boxes You would
                                            like to test
                                        </label>
                                    </div>
                                    <div>
                                        <span className="cb mr-3">
                                            CBC{" "}
                                            <input
                                                value="CBC"
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleCheckBox(
                                                        e.target.value,
                                                        e.target.checked,
                                                        index
                                                    );
                                                }}
                                            />
                                        </span>
                                        <span className="cb mr-3">
                                            PT{" "}
                                            <input
                                                value="PT"
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleCheckBox(
                                                        e.target.value,
                                                        e.target.checked,
                                                        index
                                                    );
                                                }}
                                            />
                                        </span>
                                        <span className="cb mr-3">
                                            HA1{" "}
                                            <input
                                                value="HA1"
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleCheckBox(
                                                        e.target.value,
                                                        e.target.checked,
                                                        index
                                                    );
                                                }}
                                            />
                                        </span>
                                        <span className="cb mr-3">
                                            BMP{" "}
                                            <input
                                                value="BMP"
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleCheckBox(
                                                        e.target.value,
                                                        e.target.checked,
                                                        index
                                                    );
                                                }}
                                            />
                                        </span>
                                        <span className="cb mr-3">
                                            LP{" "}
                                            <input
                                                value="LP"
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleCheckBox(
                                                        e.target.value,
                                                        e.target.checked,
                                                        index
                                                    );
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    {patient && (
                        <button
                            className="btn-primary btn-block mt-3"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? "Please Wait..." : "Confirm"}
                        </button>
                    )}
                </>
            )}
            {view === "checkData" && (
                <>
                    <label htmlFor="">Please Enter The Room Number</label>
                    <input
                        className="form-control"
                        type="text"
                        name=""
                        ref={roomNum}
                    />
                    <input
                        disabled={loading}
                        className="btn btn-block btn-primary mt-3"
                        type="button"
                        value={loading ? "Please Wait" : "Search The Room"}
                        onClick={handleGetData}
                    />
                    {roomData && (
                        <>
                            {roomData.map((item) => {
                                return (
                                    <li
                                        className="list-group-item"
                                        key={item._id}
                                    >
                                        {`${item.patientName}  ${item.time}`}
                                    </li>
                                );
                            })}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
