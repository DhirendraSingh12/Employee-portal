import React, { useState, useEffect } from "react";
import "./Perks.css";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";
import { Link } from "react-router-dom";
import CommonHeader from "../../../components/CommonHeader/index";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { fetchPerksDatas } from "../../EmpApiServices";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";

const PerksData = () => {
  const [showAll, setShowAll] = useState(true);
  const [isInternalActive, setIsInternalActive] = useState(null);
  const [perks, setPerks] = useState([]); // State for storing perks data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for error handling

  const handleTogglePerks = (type) => {
    if (type === "All") {
      setShowAll(true);
      setIsInternalActive(null);
    } else if (type === "Internal") {
      setShowAll(false);
      setIsInternalActive(true);
    } else if (type === "External") {
      setShowAll(false);
      setIsInternalActive(false);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPerksDatas();
      setPerks(data);
    } catch (error) {
      setError("Failed to fetch perks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPerks = perks.filter((perk) => {
    if (showAll) return true;
    if (isInternalActive === true)
      return perk.perkType && perk.perkType.toLowerCase() === "internal";
    if (isInternalActive === false)
      return perk.perkType && perk.perkType.toLowerCase() === "external";
    return false;
  });

  const handleRefreshClick = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <>
      <Header
        siteName={"My Perks"}
        userName={"Jaideep"}
        showLinks={["perks"]}
      />
      <div className="my-perks-container">
        <CommonHeader
          showIcons={{ plus: false, trash: false, rotate: true }}
          showCheckbox={false}
          handleRefreshClick={handleRefreshClick}
          showSearchFilter={false}
        />
        <div className="tablebody">
          <section>
            <div className="FilterPerks">
              <h2>Sort By Tags</h2>
              <DynamicButton
                text="All"
                onClick={() => handleTogglePerks("All")}
                height="40px"
                width="100px"
                backgroundColor={showAll ? "#007bff" : "#ccc"} // Change color based on state
                color="#ffffff"
              />
              <DynamicButton
                text="Internal"
                onClick={() => handleTogglePerks("Internal")}
                height="40px"
                width="100px"
                backgroundColor={isInternalActive ? "#007bff" : "#ccc"} // Change color based on state
                color="#ffffff"
              />
              <DynamicButton
                text="External"
                onClick={() => handleTogglePerks("External")}
                height="40px"
                width="100px"
                backgroundColor={
                  isInternalActive === false ? "#007bff" : "#ccc"
                } // Change color based on state
                color="#ffffff"
              />
            </div>
          </section>
          {loading ? (
          <LinearIndeterminate />
        ) : (
          <section>
            <div className="Perks-content">
              {loading ? (
                <Typography>Loading perks...</Typography>
              ) : error ? (
                <Typography>{error}</Typography>
              ) : (
                filteredPerks.map((perk) => (
                  <div key={perk.perkId} className="box">
                    <div className="perks-header">
                      <div style={{ paddingRight: "10px" }}>
                        <img
                          src="/assets/logo/bulb-removebg-preview.png"
                          alt="perk-icon"
                        />
                      </div>
                      <div>
                        <div className="title">{perk.perkName}</div>
                      </div>
                    </div>
                    <div className="btn-container">
                      <Accordion
                        style={{
                          backgroundColor: "#fdfbff",
                          boxShadow: "none",
                        }}
                      >
                        <div className="ShowDetails">
                          <AccordionSummary>
                            <h2>Show Details</h2>
                          </AccordionSummary>
                        </div>
                        <AccordionDetails>
                          <Typography>{perk.description}</Typography>
                          <Typography>
                            Url:{" "}
                            <span style={{ color: "blue" }}>
                              <Link to={perk.url}>{perk.url}</Link>
                            </span>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
                          )}{" "}
          
        </div>
        
      </div>
      <Footer paragraph="If you have any questions or need further information about our benefits, please don't hesitate to email HR@hireflex247.com. Our HR team is always ready to assist you with any queries or clarifications you may need." />
    </>
  );
};

export default PerksData;
