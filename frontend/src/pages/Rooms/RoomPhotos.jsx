import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
	SortableContainer,
	SortableElement
} from 'react-sortable-hoc';

import FileUploadProgress from 'react-fileupload-progress';

import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';
// import { getAuthHeader } from 'services/config';
import { API_HOST } from 'services/config';
import ManageRoomHeader from "components/rooms/ManageRoomHeader";
import ManageRoomFooter from "components/rooms/ManageRoomFooter";

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/room_basics.scss';
import 'assets/styles/rooms/room_photo.scss';

const arrayMove = require('array-move');

// Each Room Item to be displayed.
const PhotoItem = (props) => {
	return (
		<div className="col-12 col-lg-4 col-md-6 row-space-4 room-item" >
			<div className="">
				<div className="media-cover text-center">
					{/* <img src={path} className="img-responsive" alt="" /> */}
					<img src={props.value.name} className="img-responsive" alt="" />
				</div>
				<button 
					className="overlay-btn js-delete-photo-btn"
					onClick={() => props.removeHandler(props.value.id)}
					distance={1}
				>
					<FontAwesomeIcon icon={faTrashAlt} size="lg" />
				</button>
				<div className="panel-body panel-condensed">
					<textarea
						cols={1} rows={3}
						placeholder="What are the highlights of this photo?"
						className="input-large input highlights "
						tabIndex={1}
						defaultValue={props.value.highlights}
						onChange={(event) => props.changeHighlight(event, props.value.id)}
					/>
					<p className="ml-error ng-binding" />
				</div>
			</div>
		</div>
	)
}

const SortableItem = SortableElement(({ value, index, removeHandler, highlightHandler }) => {
	return (
		<PhotoItem
			value={value}
			key={`item-${index}`}
			removeHandler={removeHandler}
			changeHighlight={highlightHandler}
		/>
	);
});

const SortableList = SortableContainer(({ items, highlightHandler, featureHandler, removeHandler }) => {
	return (
		<ul id="js-photo-grid" className="room-card list-unstyled all-slides d-flex flex-wrap ui-sortable">
			<div className="row d-flex w-100">
				{items.map((value, index) => (
					<SortableItem
						key={`item-${index}`}
						index={index}
						value={value}
						highlightHandler={highlightHandler}
						featureHandler={featureHandler}
						removeHandler={removeHandler}
					/>
				))}
			</div>
		</ul>
	);
});

class RoomPhotos extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			photo_list: [],
			is_uploading: false,
			percentage: 0,
			uploaded_files: [],
		};

		this.removePhoto = this.removePhoto.bind(this);
		this.featurePhoto = this.featurePhoto.bind(this);
		this.changeHighlight = this.changeHighlight.bind(this);
		this.onSortEnd = this.onSortEnd.bind(this);
	}

	componentDidMount() {
		roomsService.getPhotoList(this.props.match.params.room_id).then(res => {
			if (res) {
				this.setState({ photo_list: res });
			} else {
				alertService.showError('Get Photo List');
			}
		});
	}
	
	beforeSend(request) {
    // document
    //   .getElementById("imageuploadprogressbar")
    //   .setAttribute("style", "opacity:0");
    // document.getElementById("checkmessage").innerHTML = "";
    // progressActiveCheck = true;
		// console.log('REQ => ', request)
		// const headers = getAuthHeader();
		// console.log('Header => ', headers)
		// const new_req = Object.assign(request, {headers}, {method:'POST'})

    return request;
  }

	changeHighlight(event, photo_id) {
		let value = event.target.value;
		let req = {
			data: value,
			photo_id: photo_id
		};
		roomsService.updatePhoto(req).then(res => {
			if (res) {
			} else {
				alertService.showError('Update Photo List');
			}
		});
	}

	featurePhoto(photo_id) {
		let req = {
			id: this.props.match.params.room_id,
			photo_id: photo_id
		}
		roomsService.getFeaturePhoto(req).then(res => {
			if (res) {
				this.setState({ photo_list: res });
				this.props.onUpdateSidebar();
			} else {
				alertService.showError('Get Feature Photo');
			}
		})
	}

	removePhoto(photo_id) {
		let req = { photo_id };
		roomsService.deletePhoto(this.props.match.params.room_id, req).then((res) => {
			if (res && res.success === 'true') {
				let photo_list = this.state.photo_list;
				let photo_index = photo_list.findIndex((photo) => {
					return photo.id === photo_id;
				})

				if (photo_index > -1) {
					photo_list.splice(photo_index, 1);
					this.setState({ photo_list });
				}
				this.props.onUpdateSidebar();
			} else {
				alertService.showError('Remove Photo');
			}
		});
	}

	onSortEnd({ oldIndex, newIndex }) {
		this.setState({
			photo_list: arrayMove(this.state.photo_list, oldIndex, newIndex)
		}, () => {
			// Change Photo Order
			let image_ids = this.state.photo_list.map((listing) => { return listing.id });
			let req = {
				id: this.props.match.params.room_id,
				image_id: image_ids 
			}
			roomsService.changePhotoOrder(req).then(res => {
				if (res) {
					this.featurePhoto(this.state.photo_list[0].id);
					this.props.onUpdateSidebar();
				}
			});
		})
	};

	render() {
		const room_id = this.props.match.params.room_id;

		return (
			<div className="manage-listing-content-wrapper room-photo">
				<div className="listing_whole col-md-9" id="js-manage-listing-content">
					<div className="common_listpage">
						<ManageRoomHeader
							title="Photos Can Bring Your Space to Life"
							descr="Add photos of areas guests have access to. You can always come back later and add more."
							prev="amenities"
							next="video"
							room_id={room_id}
						/>

						{/* Upload Images */}
						<FileUploadProgress
							key="uploader"
							method="post"
							beforeSend={this.beforeSend.bind(this)}
							url={`${API_HOST}/ajax/rooms/add_photos/${this.props.match.params.room_id}`}
							formRenderer={this.UploadRenderer.bind(this)}
							formGetter={this.formGetter.bind(this)}
							onProgress={this.onUploading.bind(this)}
							onLoad={(e, request) => { this.onLoad(e, request); }}
							onError={(e, request) => { console.log('error', e, request); }}
							onAbort={(e, request) => { console.log('abort', e, request); }}
						/>

						{/* Upload Images */}

						{/* Room Thumbnails */}
						<SortableList
							distance={1}
							axis="xy"
							items={this.state.photo_list}
							highlightHandler={this.changeHighlight}
							removeHandler={this.removePhoto}
							onSortEnd={this.onSortEnd}
						/>
						{/* <div className="row room-card">
							{roomItems}
						</div> */}
						{/* Room Thumbnails */}

						<ManageRoomFooter
							prev="amenities"
							next="video"
							room_id={room_id}
						/>
						<hr />
					</div>
				</div>

				<div className="col-md-3 col-sm-12 listing_desc location_desc">
					<div className="manage_listing_left">
						<img src={property_help} className="col-center" width={75} height={75} alt="property help" />
						<div className="amenities_about">
							<h4>Guests Love Photos</h4>
							<p>
								Tell your guests how many bedrooms and bathrooms your property has. If you have multiple beds in the same bedroom, you can state that as well. For sleeper sofas in the living room, simply name the bedroom "Living Room" and select the number of sleeper sofas you have.
              </p>
						</div>
					</div>
				</div>
			</div >
		);
	}

	// Custom Upload Renderer
	UploadRenderer(onSubmit) {
		return (
			<form id="upload-bar" className="upload-bar">
				<div className="button-container">
					<button
						type="button"
						className="btn-uploader"
						style={{ border: "#d2950c" }}
					>
						<FontAwesomeIcon icon={faCamera} size="2x" />
					</button>
					<button
						type="button"
						className="btn-photos"
						style={{ border: "#d2950c" }}
					>
						<div className="d-flex">
							<span>Minimum 1 Photo Required{" "}</span>
							<span className="requiredRJ">{" *"}</span>
						</div>
						<div className="d-flex">Max Filesize = 5MB</div>
					</button>
					<input className="fileupload" type="file" name="photos[]" multiple onChange={onSubmit} />
				</div>

				<div
					className="photo-counter"
				>
					<svg width="28px" height="28px" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px'}}>
						<path fill="#23537a" d="M704 576q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1024 384v448h-1408v-192l320-320 160 160 512-512zm96-704h-1600q-13 0-22.5 9.5t-9.5 22.5v1216q0 13 9.5 22.5t22.5 9.5h1600q13 0 22.5-9.5t9.5-22.5v-1216q0-13-9.5-22.5t-22.5-9.5zm160 32v1216q0 66-47 113t-113 47h-1600q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1600q66 0 113 47t47 113z"/>
					</svg>
					{this.state.photo_list.length}{" "} Photos
				</div>
			</form>
		);
	}

	// Custom FormData Getter
	formGetter() {
		return new FormData(document.getElementById('upload-bar'));
	}

	// Progress Listener
	onUploading(e, request, progress) {
		// console.log("Progress(e)", e);
		// console.log("Progress(request)", request);
		// console.log("Progress(progress)", progress);
	}

	// After Uploading
	onLoad(e, request) {
		alertService.showSuccess('Upload image');
		let result = JSON.parse(request.response);
		this.setState({
			photo_list: result.succresult,
			percentage: 100,
		});
		this.props.onUpdateSidebar();
	}
}

export default RoomPhotos;
