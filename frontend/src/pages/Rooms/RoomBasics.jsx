import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';

import ManageRoomHeader from "components/rooms/ManageRoomHeader";
import ManageRoomFooter from "components/rooms/ManageRoomFooter";

import {roomsService} from 'services/rooms';

import 'assets/styles/rooms/room_basics.scss';
import property_help from 'assets/images/property-help.png';

class RoomBasics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      removeModalShow: false,
      visible: false,
      visible_bathmodal: false,
      page_data: {},
      post_data: {
        bedroom_data: {
          bedroom_id: null,
          babycrib: 0,
          bedroom_name: "",
          bunkbed: 0,
          murphy: 0,
          nochildbed: 0,
          noof_king: 0,
          noofdouble: 0,
          nooqueen: 0,
          nosleepsofa: 0,
          twinsingle: 0
        },
        bathroom_data: {
          bathroom_name: "",
          bathroom_type: "",
          bathfeature: []
        }
      },
      is_add_bedroom: true,
      is_add_bathroom: true
    };
    this.handleInputBedroomDetail = this.handleInputBedroomDetail.bind(this);
    this.handleBedroomSubmit = this.handleBedroomSubmit.bind(this);
    this.handleEditBedroomShow = this.handleEditBedroomShow.bind(this);
    this.handleRemoveBedroom = this.handleRemoveBedroom.bind(this);
    this.handleBathroomInputDetails = this.handleBathroomInputDetails.bind(this);
    this.handleBathroomSubmit = this.handleBathroomSubmit.bind(this);
    this.handleEditBathroomShow = this.handleEditBathroomShow.bind(this);
    this.handleRemoveBathroom = this.handleRemoveBathroom.bind(this);
  }

  componentDidMount() {
    const room_id = this.props.match.params.room_id;
    roomsService.getBasicsData(room_id).then(res => {
      if (res) {
        this.setState({page_data : res});
      } else {
        
      }
    });
  }

  handleInputBedroomDetail(e) {
    e.preventDefault();
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const post_data = this.state.post_data;
    post_data.bedroom_data[name] = value;
    this.setState({post_data : post_data});
  }

  handleBathroomInputDetails(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const post_data = this.state.post_data
    if (target.type === 'checkbox'){
      const temp_array =  post_data.bathroom_data.bathfeature;
      if (temp_array && temp_array.indexOf(value) !== -1){
        temp_array.splice(temp_array.indexOf(value), 1)
      }
      else {
        temp_array.push(value)
      }
      post_data.bathroom_data[name] = temp_array;
    }
    else {
      post_data.bathroom_data[name] = value;
    }
    this.setState({
      post_data : post_data
    });
  }

  handleBedroomSubmit(e) {
    e.preventDefault();

    const bedroom_data = this.state.post_data.bedroom_data;
    const room_id = this.props.match.params.room_id;

    if(this.state.post_data.bedroom_data.bedroom_name) {
      if (bedroom_data.babycrib || 
          bedroom_data.bunkbed || 
          bedroom_data.murphy || 
          bedroom_data.nochildbed || 
          bedroom_data.noof_king || 
          bedroom_data.noofdouble || 
          bedroom_data.nooqueen || 
          bedroom_data.nosleepsofa || 
          bedroom_data.twinsingle) {
    		const _self = this;
    		const post_data = _self.state.post_data.bedroom_data;
    		post_data.room_id  = room_id;

    		if(this.state.is_add_bedroom === true) {
          roomsService.updateBedRoom(post_data).then(res => {
            if (res.status === 'success') {
    					toast.success("New Room Created Successfully", {position: toast.POSITION.TOP_RIGHT});
    					const page_data = this.state.page_data;
    					page_data.bedrooms.push(res.result)
    					this.setState({
    						visible : false,
    						page_data : page_data
    					});
              this.props.onUpdateSidebar();
    				}
    				else{
    					toast.error(res.message, {position: toast.POSITION.TOP_RIGHT});
    				}
          });
    		}
    		else {
    			post_data.id = _self.state.post_data.bedroom_data.bedroom_id
    			roomsService.updateBedRoom(post_data).then(res => {
    				if (res.status === 'success') {
    					toast.success(res.message, {position: toast.POSITION.TOP_RIGHT});
    					const page_data = this.state.page_data;
    					const bed_room_index = page_data.bedrooms.findIndex((bedroom, index) => {
    						return bedroom.id === res.result.id
    					});

              page_data.bedrooms[bed_room_index] = res.result;
              
    					this.setState({
    						visible : false,
    						page_data : page_data
    					});
              this.props.onUpdateSidebar();
    				}
    				else{
    					toast.error(res.message, {position: toast.POSITION.TOP_RIGHT});
    				}
    			});
    		}
    	}
    	else {
    		toast.error('At least one of above fields must be selected!.', {position: toast.POSITION.TOP_RIGHT});
    	}

    }
    else{
    	toast.error('Please Input Bedroom Name', {position: toast.POSITION.TOP_RIGHT});
    }
  }

  handleBathroomSubmit(e) {
    e.preventDefault();

    const bathroom_data = this.state.post_data.bathroom_data;
    if(bathroom_data.bathroom_name) {
    	if(bathroom_data.bathroom_type) {
    		const post_data = this.state.post_data.bathroom_data;
    		post_data.room_id  = this.props.match.params.room_id;

    		if(this.state.is_add_bathroom === true){
          roomsService.updateBathRoom(post_data).then(res => {
    				if (res.status === 'success') {
    					const page_data = this.state.page_data;
    					page_data.bathrooms.push(res.result);

    					toast.success("New Bathroom Created Successfully", {position: toast.POSITION.TOP_RIGHT});
    					this.setState({
    						visible_bathmodal : false,
    						page_data : page_data,
    						is_add_bathroom : true
    					});
              this.props.onUpdateSidebar();
    				}
    				else {
    					toast.error(res.message, {position: toast.POSITION.TOP_RIGHT});
    				}
    			})
    		}
    		else {
    			post_data.id = this.state.post_data.bathroom_data.bathroom_id;
    			roomsService.updateBathRoom(post_data).then(res => {
    				if (res.status === 'success') {
    					const page_data = this.state.page_data;
    					const bath_room_index = page_data.bathrooms.findIndex((bathroom, index) =>{
    						return bathroom.id === res.result.id;
    					});

    					page_data.bathrooms[bath_room_index] = res.result;

    					this.setState({
    						visible_bathmodal : false,
    						page_data : page_data,
    						is_add_bathroom : false
    					});
              this.props.onUpdateSidebar();

    					toast.success("Bathroom Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
    				}
    				else {
    					toast.error(res.message, {position: toast.POSITION.TOP_RIGHT});
    				}
    			});
    		}
    	}
    	else{
    		toast.error('Please Choose Bathroom Type', {position: toast.POSITION.TOP_RIGHT});
    	}
    }
    else{
    	toast.error('Please Input Bathroom Name', {position: toast.POSITION.TOP_RIGHT});
    }
  }

  handleEditBedroomShow(bedroom_id, room_id, bedroom) {
    let post_data = this.state.post_data;
    let bedroom_detail = JSON.parse(bedroom.bedroom_details);

    post_data.bedroom_data = {
      babycrib: bedroom_detail.babycrib,
      bedroom_name: bedroom.bedroom_name,
      bunkbed: bedroom_detail.bunk,
      murphy: bedroom_detail.murphy,
      nochildbed: bedroom_detail.child,
      noof_king: bedroom_detail.king,
      noofdouble: bedroom_detail.double,
      nooqueen: bedroom_detail.queen,
      nosleepsofa: bedroom_detail.sleepsofa,
      twinsingle: bedroom_detail.single,
      bedroom_id: bedroom_id
    };

    this.setState({
      is_add_bedroom: false,
      post_data: post_data,
      visible: true
    });
  }

  handleEditBathroomShow(bathroom_id, room_id, bathroom) {
    const post_data = this.state.post_data;
    post_data.bathroom_data = {
    	bathroom_id : bathroom_id,
    	bathroom_name : bathroom.bathroom_name,
    	bathroom_type : bathroom.bathroom_type,
    	bathfeature :  bathroom.bathfeature ? bathroom.bathfeature.split(',') : []
    }
    this.setState({
    	is_add_bathroom : false,
    	post_data : post_data,
    	visible_bathmodal : true
    })
    const checlbox_array = document.getElementsByClassName('checkbox_check');
    for(let i = 0 ; i < checlbox_array.length ;  i ++ ) {
    	checlbox_array[i].checked = false;
    }

    this.state.post_data.bathroom_data.bathfeature.map((item) =>{
      document.getElementById(item).checked = true;
      return true;
    });
  }

  handleRemoveBedroom(bedroom_id, room_id) {
    roomsService.deleteBedRoom(bedroom_id, room_id).then(res => {
      if (res.status === 'success') {
    		toast.success("New Room Created Successfully", {position: toast.POSITION.TOP_RIGHT});
    		const page_data = this.state.page_data;
    		page_data.bedrooms = res.bedrooms;
    		this.setState({
    			visible : false,
    			page_data : page_data
    		});
        this.props.onUpdateSidebar();
    	}
    	else {
    		toast.error(res.message, {position: toast.POSITION.TOP_RIGHT});
    	}
    });
  }

  handleRemoveBathroom(bathroom_id, room_id) {
    roomsService.deleteBathRoom(bathroom_id, room_id).then(res => {
    	if (res.status === 'success') {
    		toast.success("Bathroom Removed Successfully", {position: toast.POSITION.TOP_RIGHT});
    		const page_data = this.state.page_data;
    		page_data.bathrooms = res.bathrooms;
    		this.setState({
    			visible : false,
    			page_data : page_data
    		});
        this.props.onUpdateSidebar();
    	}
    	else {
    		toast.error(res.message, {position: toast.POSITION.TOP_RIGHT});
    	}
    });
  }

  openModal() {
    const post_data = this.state.post_data;
    post_data.bedroom_data = {
      babycrib: 0,
      bedroom_name: "",
      bunkbed: 0,
      murphy: 0,
      nochildbed: 0,
      noof_king: 0,
      noofdouble: 0,
      nooqueen: 0,
      nosleepsofa: 0,
      twinsingle: 0,
      bedroom_id: null
    };

    this.setState({
      visible: true,
      is_add_bedroom: true
    });
  }

  openBathModal() {
    const post_data = this.state.post_data;
    post_data.bathroom_data = {
    	bathroom_id : null,
    	bathroom_name :'',
    	bathroom_type : '',
    	bathfeature :   []
    }

    const checlbox_array = document.getElementsByClassName('checkbox_check');
    for(let i = 0 ; i < checlbox_array.length ;  i ++ ) {
    	checlbox_array[i].checked = false
    }

    this.setState({
    	is_add_bathroom : true,
    	post_data : post_data,
    	visible_bathmodal : true
    })
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }
  closeBathModal() {
    this.setState({
      visible_bathmodal: false
    });
  }

  modalContentOfAddBedRoom() {
    const items = [
      { label: "King", name: "noof_king" },
      { label: "Queen", name: "nooqueen" },
      { label: "Double", name: "noofdouble" },
      { label: "Twin / single", name: "twinsingle" },
      { label: "Bunk bed", name: "bunkbed" },
      { label: "Child bed", name: "nochildbed" },
      { label: "Sleep sofa / futon", name: "nosleepsofa" },
      { label: "Murphy bed", name: "murphy" },
      { label: "Baby crib", name: "babycrib" }
    ];

    return (
      <div className="panel rjbedbathpanel">
        <div className="panel-header">
          <div className="h4 js-address-nav-heading">Add Bedroom</div>
        </div>

        <form id="editbedroomsForm" name="editbedroomsForm" method="post" onSubmit={this.handleBedroomSubmit} style={{ overFolwY: "scroll" }}>
          <div className="panel-body">
            <div className="col-md-12">
              <label>Bedroom Name</label>
              <input type="text" name="bedroom_name" value={this.state.post_data.bedroom_data.bedroom_name} className="form-control rjcontrol" placeholder="Bedroom Name" required="" onChange={this.handleInputBedroomDetail}/>
            </div>

            {
							items.map((item, index) => {
              	return (
									<div key={index} className="col-6 col-md-4 float-left">
										<label>{item.label}</label>
										<select
											name={item.name}
											value={this.state.post_data.bedroom_data[item.name]}
											className="form-control rjcontrol"
											onChange={this.handleInputBedroomDetail}
										>
											<option defaultValue="0">0</option>
											<option value="1">1</option>
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
											<option value="5">5</option>
										</select>
									</div>
								);
							})
						}
          </div>

          <div className="panel-footer">
            <div className="force-oneline">
              <button onClick={() => this.closeModal()} className="btn js-secondary-btn">
                Cancel
              </button>
              <button id="bedroom_submit" type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
	}
	
	modalContentOfAddBathRoom() {
		const items1 = [
			{label: 'Toilet', id: 'Toilet'},
			{label: 'Tub', id: 'Tub'},
			{label: 'Bidet', id: 'Bidet'}
		]
		const items2 = [
			{label: 'Jetted tub', id: 'Jetted tub'},
			{label: 'Shower', id: 'Shower'},
			{label: 'Outdoor shower', id: 'Outdoor shower'}
		]

		return (
			<div id="js-bedroom-bathroom-container" className="enter_address">
				<div className="panel rjbedbathpanel ng-scope">
					<div className="panel-header">
						<Link to="#" data-behavior="modal-close" className="modal-close"/>
						<div className="h4 js-address-nav-heading">
							Add Bathroom
						</div>
					</div>

					<form id="editbathroomsForm" name="editbathroomsForm" onSubmit={this.handleBathroomSubmit}>
						<div className="panel-body">
							<div className="col-6 float-left">
								<label>Bathroom Name</label>
								<input type="text" onChange={this.handleBathroomInputDetails} value={this.state.post_data.bathroom_data.bathroom_name} name="bathroom_name" className="form-control rjcontrol" placeholder="Bathroom Name" required/>
								<span className="has-error">
									<span style={{ opacity: 0 }} className="help-block help-block-error">
										This field is required!
									</span>
								</span>
							</div>
							<div className="col-6 float-left" ng-init="bathroom_type=''">
								<label>Bathroom Type</label>
								<select name="bathroom_type" onChange={this.handleBathroomInputDetails} value={this.state.post_data.bathroom_data.bathroom_type} className="form-control rjcontrol" required>
									<option value>Select bathroom type</option>
									<option value="Full">Full</option>
									<option value="Half">Half</option>
									<option value="Shower">Shower</option>
								</select>
								<span className="has-error">
									<span style={{ opacity: 0 }} className="help-block help-block-error">
										This field is required!
									</span>
								</span>
							</div>
							<h3 className="bathfeaturerj">Bathroom Feature</h3>
							<div className="col-6 float-left">
								{
									items1.map( (item, index) => {
										return (
											<div key={`bedroom_1_${index}`} className="rjlabelroom">
												<label className="rj_container">
													{item.label}
													<input type="checkbox" className="checkbox_check" name="bathfeature" id={item.id} value={item.id} onChange={this.handleBathroomInputDetails}
														defaultChecked={this.state.post_data.bathroom_data.bathfeature.indexOf(item.id) !== -1}/>
													<span className="checkmark" />
												</label>
											</div>
										)
									})
								}
							</div>

							<div className="col-6 float-left">
								{
									items2.map( (item, index) => {
										return (
											<div key={`bedroom_2_${index}`} className="rjlabelroom">
												<label className="rj_container">
													{item.label}
													<input type="checkbox" className="checkbox_check" name="bathfeature" 
														id={item.id} defaultValue={item.id} onChange={this.handleBathroomInputDetails}
														defaultChecked={this.state.post_data.bathroom_data.bathfeature.indexOf(item.id) !== -1}/>
													<span className="checkmark" />
												</label>
											</div>
										)
									})
								}
							</div>
						</div>
						<div className="panel-footer">
							<div className="force-oneline">
								<button data-behavior="modal-close" className="btn js-secondary-btn">
									Cancel
								</button>
								<button id="bathroomsubmit" className="btn btn-primary">
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}

  render() {
		const add_bedroom_modal = this.modalContentOfAddBedRoom();
    const add_bathroom_modal = this.modalContentOfAddBathRoom();
    const room_id = this.props.match.params.room_id;

		let bedroom_list = <span className='mr-4'>No Bedrooms Yet!</span>
		if(this.state.page_data.bedrooms) {
			bedroom_list = this.state.page_data.bedrooms.map( bedroom => {
				let bedroom_detail = JSON.parse(bedroom.bedroom_details)
				return (
					<div className="bedroom_rj d-flex" key={bedroom.id}>
            <div className="basic-item-text">
              <h5>{bedroom.bedroom_name}</h5>
              <p><b>Beds:</b>
                <span style={{textTransform: 'capitalize'}}>king ({bedroom_detail.king}), </span>
                <span style={{textTransform: 'capitalize'}}>queen ({bedroom_detail.queen}), </span>
                <span style={{textTransform: 'capitalize'}}>double ({bedroom_detail.double}), </span>
                <span style={{textTransform: 'capitalize'}}>single ({bedroom_detail.single}), </span>
                <span style={{textTransform: 'capitalize'}}>bunk ({bedroom_detail.bunk}), </span>
                <span style={{textTransform: 'capitalize'}}>child ({bedroom_detail.child}), </span>
                <span style={{textTransform: 'capitalize'}}>sleepsofa ({bedroom_detail.sleepsofa}), </span>
                <span style={{textTransform: 'capitalize'}}>murphy ({bedroom_detail.murphy}), </span>
                <span style={{textTransform: 'capitalize'}}>babycrib ({bedroom_detail.babycrib}), </span>
                ;
              </p>
            </div>

            <div className="basic-item-action">
              <Link to="#" className="editbedrooms" id="js-edit-bedrooms"  onClick={() => this.handleEditBedroomShow(bedroom.id, bedroom.room_id, bedroom)}>
                <FontAwesomeIcon icon={faPencilAlt}/>
              </Link> 
              <Link to="#" className="deletebedrooms"  onClick={()=>this.handleRemoveBedroom(bedroom.id, bedroom.room_id)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </Link>
            </div>

					</div>
				)
			})
    }
    
		let bathroom_list = <span className='mr-4'>No Bathroom Yet!</span>
		if(this.state.page_data.bathrooms){
			bathroom_list = this.state.page_data.bathrooms.map((bathroom) => {
				return (
					<div className="bedroom_rj d-flex" key={bathroom.id}>
            <div className="basic-item-text">
              <h5>{bathroom.bathroom_name}</h5>
              <p><b>BathRoom type:</b> <span>{bathroom.bathroom_type}</span></p>
              <p><b>Included Feature:</b> {bathroom.bathfeature}</p>
            </div>
            <div className="basic-item-action">
              <Link to="#" className="editbedrooms"  onClick={() => this.handleEditBathroomShow(bathroom.id, bathroom.room_id, bathroom)}>
                <FontAwesomeIcon icon={faPencilAlt}/>
              </Link>
              <Link to="#" className="deletebathrooms" onClick={()=>this.handleRemoveBathroom(bathroom.id, bathroom.room_id)} >
                <FontAwesomeIcon icon={faTrashAlt}/>
              </Link>
            </div>
					</div>
				)
			})
		}

    return (
      <div className="body__room-basic manage-listing-content-wrapper">
        <Modal open={this.state.visible} onClose={() => this.closeModal()} center styles={{ modal: { padding: "0px" } }}>
          {add_bedroom_modal}
        </Modal>
        
        <Modal open={this.state.visible_bathmodal} onClose={() => this.closeBathModal()} center styles={{ modal: { padding: "0px" } }}>
          {add_bathroom_modal}
        </Modal>

        <div className="listing_whole col-md-9" id="js-manage-listing-content">
          <div className="common_listpage">
            <ManageRoomHeader 
              title="Help Travelers Find the Right Fit" 
              descr="People searching on Vacation.Rentals----- can filter by listing basics to find a space that matches their needs." 
              next="description" 
              room_id={room_id}/>

            <div className="js-section list_hover col-sm-12 bathbedrj">
              <div className="base_decs">
                <h3>
                  Bedrooms <span className="requiredRJ">*</span>
                </h3>
              </div>
              <div className="base_text d-flex">
                <div className="rj_list_property" id="alloverbedroomsList">
                  {bedroom_list}
                  
                  <button type="button" className="rj_add_bedroom_btn" id="js-add-bedrooms" style={{ border: "#d2950c" }} value="Open" onClick={() => this.openModal()}>
                    Add a bedroom
                  </button>
                </div>
              </div>
            </div>
            <div className="js-section list_hover col-sm-12 bathbedrj">
              <div className="base_decs">
                <h3>Bathroom (Optional)</h3>
              </div>
              <div className="base_text">
                <div className="rj_list_property" id="alloverbedroomsList">
									{bathroom_list}
									
                  <button to="add_bathroom" className="popup-trigger rj_add_bedroom_btn" id="js-add-bathrooms" style={{ border: "#d2950c" }} onClick={this.openBathModal.bind(this)}>
                    Add a bathroom
                  </button>
                </div>
              </div>
            </div>
            
            <ManageRoomFooter 
              next="description" 
              room_id={room_id}/>

            <hr />
          </div>
        </div>

        <div className="col-md-3 col-sm-12 listing_desc location_desc">
          <div className="manage_listing_left">
            <img src={property_help} className="col-center" width={75} height={75} alt="property help"/>
            <div className="amenities_about">
              <h4>Bedroom/Bathroom</h4>
              <p>
                Tell your guests how many bedrooms and bathrooms your property
                has. If you have multiple beds in the same bedroom, you can
                state that as well. For sleeper sofas in the living room, simply
                name the bedroom "Living Room" and select the number of sleeper
                sofas you have.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomBasics;
