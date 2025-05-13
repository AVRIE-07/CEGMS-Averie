import { FaUserCircle } from "react-icons/fa";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";

import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DashboardBox from "../Dashboard/components/dashboardBox";

import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import userService from "../../services/userService";
import UserAvatarLetter from "../../components/userAvatarLetter";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const Users = () => {
  const [showBy, setshowBy] = useState("");
  const [showBysetCatBy, setCatBy] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService
      .getAll()
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">User List</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb label="Users" deleteIcon={<ExpandMoreIcon />} />
          </Breadcrumbs>
        </div>

        <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={<FaUserCircle />}
                grow={true}
                title="Total Users"
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={<FaUserCircle />}
                title="Pending Users"
              />

              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={<FaUserCircle />}
                title="Banned Users"
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Users</h3>
          <div className="row cardFilters mt-3">
            <div className="col-md-3">
              <h4>SHOW BY</h4>
              <FormControl size="small" className="w-100">
                <Select
                  value={showBy}
                  onChange={(e) => setshowBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="demo-select-small-label"
                  className="w-100"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="col-md-3">
              <h4>CATEGORY BY</h4>
              <FormControl size="small" className="w-100">
                <Select
                  value={showBysetCatBy}
                  onChange={(e) => setCatBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="demo-select-small-label"
                  className="w-100"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th style={{ width: "300px" }}>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Checkbox {...label} /> <span>{user.user_id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center productBox">
                        <div className="imgWrapper">
                          <UserAvatarLetter
                            first_name={user.first_name}
                            last_name={user.last_name}
                          />
                        </div>
                        <div className="info pl-3">
                          <h6>
                            {user.first_name} {user.last_name}
                          </h6>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{user.phone_number}</td>
                    <td>{user.role}</td>
                    <td>
                      <Chip
                        label={user.isVerified ? "Verified" : "Not Verified"}
                        icon={
                          user.isVerified ? <VerifiedIcon /> : <ErrorIcon />
                        }
                        color={user.isVerified ? "success" : "error"}
                        variant="filled"
                        size="small"
                      />
                    </td>
                    <td>
                      <div className="actions d-flex align-items-center">
                        <Link to="/product/details">
                          <Button className="secondary" color="secondary">
                            <FaEye />
                          </Button>
                        </Link>
                        <Button className="success" color="success">
                          <FaPencilAlt />
                        </Button>
                        <Button className="error" color="error">
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex tableFooter">
              <p>
                showing <b>12</b> of <b>60</b> results
              </p>
              <Pagination
                count={10}
                color="primary"
                className="pagination"
                showFirstButton
                showLastButton
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
