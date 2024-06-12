"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState, useEffect, Key, useContext } from "react";
import DropDown, { VibeType } from "@/components/DropDown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingDots from "@/components/LoadingDots";
import Toggle from "@/components/Toggle";
import DomainCardPlaceholder from "@/components/domain-card-placeholder";

const Home: NextPage = () => {

  useEffect(() => {
    let whatTheme = localStorage.getItem("theme") || "";  
    setCheckTheme(whatTheme)
    // Get the value from local storage if it exists
    let value = localStorage.getItem("storedFetch") || "";
    setStoredFetch(value);
  }, []);

  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Google");
  const [isPro, setIsPro] = useState(false);
  const [checkTheme, setCheckTheme] = useState('light');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [storedFetch, setStoredFetch] = useState("");

  function darkMode() {
    console.log(checkTheme)

    document.querySelector("body").style.background = "#212121";
  // document.querySelector("body").style.color = "white";

  }


  checkTheme == 'dark' ? darkMode() : null


  // console.log(Math.random().toString().slice(2))

  function Modal() {
    // setShowModal(true)
    console.log(modalData?.result);
    let resultContent = "";

    let resultListTemp = "";
    let resultTitle = "";

    // modalData?.result.map

    modalData?.result.forEach(company => {
      resultTitle = company?.category;
      resultListTemp += `<tr>
          <td>${company?.storeName}</td>
          <td>${company?.address}</td>
          <td>${company?.phone}</td>
          <td>${company?.bizWebsite}</td>
          <td>${company?.ratingText}</td>
          </tr>`
  
  });
  
  const resultTableTemp = `<h2>${resultTitle} around Texas (${modalData?.result?.length} )</h2>
  <div class="text-center">
  <button class="btn btn-default"><span class="glyphicon glyphicon-arrow-down"></span> DOWNLOAD DATA</button>
  </div>
  <br>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="table-responsive" data-pattern="priority-columns">
          <table summary="This table shows how to create responsive tables using RWD-Table-Patterns' functionality" class="table table-bordered">
            <!-- <caption class="text-center">An example of a responsive table based on RWD-Table-Patterns' <a href="http://gergeo.se/RWD-Table-Patterns/" target="_blank"> solution</a>:</caption> -->
            <thead>
              <tr>
                <th>Company Name</th>
                <th data-priority="1">Address</th>
                <th data-priority="2">Phone</th>
                <th data-priority="3">Website</th>
                <th data-priority="4">Rating</th>
              </tr>
            </thead>
            <tbody>
              ${resultListTemp}
            </tbody>
          </table>
        </div>
        <button class="btn btn-default"><span class="glyphicon glyphicon-arrow-down"></span> DOWNLOAD DATA</button>
      </div>
    </div>
  </div>`;

    return (
      
      <div className="absolute inset-0 z-10 bg-white items-center justify-center" dangerouslySetInnerHTML={{ __html: resultTableTemp }}></div>
    );
  }

  const ResultCard = ({ storedData, key }) => {
    
    const [removing, setRemoving] = useState(false);
    return (
      <div className="w-full mt-10 shadow-md border border-gray-150 rounded-lg py-4">
        {/* <span className="text-xl font-semibold text-center items-center">Eatery in Uyo</span> */}

        <div className="justify-between flex items-center space-x-3 mt-3 px-2 sm:px-10">
          {/* <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse" /> */}
          <div className="text-left font-semibold flex items-center">
            {storedData?.title}
          </div>
          <p className="text-black text-gray-500 font-normal text-sm">
            {storedData?.vibe}
          </p>
          <p className="text-black text-gray-500 font-normal text-sm">
            {storedData?.result?.length} results
          </p>
        </div>
        <div className="flex justify-between space-x-4 pt-10 px-2 sm:px-10">
          <a
            href={`http://kufre.me`}
            target="_blank"
            rel="noreferrer"
            className=" text-left font-semibold flex items-center"
          >
            <span className="inline-block ml-2"></span>
          </a>
          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault()

                console.log(this);
                console.log(storedData);
                setModalData(storedData);
                setShowModal(true);
              }}
              //   onClick={() => Modal(storedData?.result)}
              // disabled={isValidating}
              className={`bg-white hover:text-black hover:border-black text-gray-500 border-gray-200 py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
            >
              Open
              {/* <LoadingDots /> */}
              {/* {isValidating ? <LoadingDots /> : 'Refresh'} */}
            </button>
            
            <button
              // onClick={async () => {
              //   setRemoving(true)
              //   try {
              //     await fetch(`/api/remove-domain?domain=${domain}`)
              //     await revalidateDomains()
              //   } catch (error) {
              //     alert(`Error removing domain`)
              //   } finally {
              //     setRemoving(false)
              //   }
              // }}
              // disabled={removing}
              className={`${
                removing ? "cursor-not-allowed bg-gray-100" : ""
              }bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
            >
              Remove
              {/* {removing ? <LoadingDots /> : 'Remove'} */}
            </button>
          </div>
        </div>

        {/* <ConfiguredSection domainInfo={domainInfo} /> */}
      </div>
    );
  };

  async function getQueryResult(e: { preventDefault: () => void }) {
    e.preventDefault();

    console.log(searchString);
    let newStoredFetch;
    let storedArray = JSON.parse(localStorage.getItem("storedFetch"));

    let letsDo = await fetch(`/api/add-domain?query=${searchString}`);

    let checkFetch = await letsDo.json();

    let fetchedResult = await checkFetch;

    if (storedFetch == null || storedFetch == "") {
      console.log("kufre");
      localStorage.setItem(
        "storedFetch",
        JSON.stringify([
          {
            title: searchString,
            vibe: vibe,
            result: fetchedResult,
          },
        ])
      );
    } else if (storedFetch != null || storedFetch != "") {
      console.log("breezy");

      // newCartItemArray = userCarts;
      newStoredFetch = {
        title: searchString,
        vibe: vibe,
        result: fetchedResult,
      };

      storedArray?.push(newStoredFetch);
      localStorage.setItem("storedFetch", JSON.stringify(storedArray));
    }
  }

  let storedData = ''

  // let domainList: any[] = [];
  // console.log('storedFetch', JSON.parse(storedArray))

//   let storedData = JSON.parse(localStorage.getItem("storedFetch"));
  
  // console.log(storedData)

  return (
    <div className="flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Powers at your fingertips</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <p style={{color: checkTheme == 'dark' ? 'white' : 'black'}} className="border rounded-2xl py-1 px-4 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out rotating-text-wrapper">
          <span>
            <b>Excellence</b> yields <b>Opportunities</b>
          </span>
          <span>
            Think <b>Bias for Action</b>
          </span>
          <span>
            <b>89,982</b> Leads generated so far
          </span>
        </p>
        <br />
        <br />
        <h1 style={{color: checkTheme == 'dark' ? 'white' : 'black'}} className="sm:text-7xl text-3xl max-w-[708px] sm:max-w-[1100px] font-bold">
          Ambition is the first step towards
          <span className="sm:text-7xl ml-5 text-3xl font-bold gradient">
            SUCCESS
          </span>
        </h1>
        <br />
        <div className="mt-7 " style={{ scale: 1.15 }}>
          <Toggle isPro={isPro} setIsPro={setIsPro} /> 
        </div>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p style={{color: checkTheme == 'dark' ? 'white' : 'black'}} className="text-sm text-left font-medium">
              Your limitation is a function of your imagination{" "}
              <span className="text-sm text-gray-400">
                (trust me, I'm lying)
              </span>
              .
            </p>
          </div>
          <textarea
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            rows={4}
            className="w-full max-w-1xl sm:max-w-2xl rounded-md items-center border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"e.g. Oil company in USA"}
          />
          <div className="flex mb-5 items-center space-x-3">
            <p style={{color: checkTheme == 'dark' ? 'white' : 'black'}} className="text-left font-medium">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button style={{color: checkTheme == 'dark' ? 'white' : 'black', borderRadius: '0.375rem'}} className="border text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out rotating-button-wrapper bg-black text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full">
            <span>
                <b>Apply</b> <b> Pressure</b>
            </span>
            <span>
                <b>Powers</b>
                <b> on your Fingertips</b>
            </span>
            <span>
                <b>Powers</b>
                <b> on your Fingertips</b>
            </span>
          </button>
            // <button
            //   className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            //   onClick={getQueryResult}
            // >
            //   Apply pressure &rarr;
            // </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <br />
        <br />
        <div className="w-full max-w-1xl sm:max-w-2xl">
          <div className="w-full max-w-1xl sm:max-w-2xl">
            {
              storedData ? (
                // [...storedData].map((_ ,key) => {
                //   return <ResultCard storedData={_} key={key}/>
                // })
                // for (let step = 0; step < 5; step++) {
                //   // Runs 5 times, with values of step 0 through 4.
                //   console.log("Walking east one step");
                // }
                storedData.map(
                  (storedData: any, index: Key | null | undefined) => {
                    console.log(index);
                    return <ResultCard key={index} storedData={storedData} />;
                  }
                )
              ) : (
                <DomainCardPlaceholder key={1} />
              )
              // [1, 2, 3, 4, 5].map((_, index) => {
              //     return <DomainCardPlaceholder key={1} />
              //   })
            }
          </div>
          {showModal && <Modal />}
          {/* <button onClick={() => setShowModal(true)}>Open Modal</button>
          
        {showModal &&
            <Modal  />
        }
        <DomainCardPlaceholder key={1} />
          <ResultCard /> */}
          {/* {[1, 2, 3, 4, 5].map((_, index) => {
                return <DomainCardPlaceholder key={1} />;
              })} */}
        </div>
        {/* <div className="max-w-[400px] mt-20 sm:max-w-[1100px]">
          <div dangerouslySetInnerHTML={{ __html: result }}></div>
          </div> */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
