import React from 'react'
import Picker from './Picker';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import moment from 'moment';
import ScriptCache from 'shared/ScriptCache';
import {GOOGLE_MAP_KEY} from 'services/config';

import 'assets/styles/home/searchbar.scss';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
      startValue: null,
      endValue: null,
      startOpen: false,
      endOpen: false,
      width: 0,
      height: 0,
			address: '',
			gmap_api_loaded: false
		}
		
		this.onStartOpenChange = this.onStartOpenChange.bind(this)
    this.onEndOpenChange = this.onEndOpenChange.bind(this)
    this.onStartChange = this.onStartChange.bind(this)
    this.onEndChange = this.onEndChange.bind(this)
    this.disabledStartDate = this.disabledStartDate.bind(this)
    this.handleChange = this.handleChange.bind(this)
		this.handleSelect = this.handleSelect.bind(this)
	}

	componentDidMount() {
		window.requestAnimationFrame( () => {
			new ScriptCache([`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`]).onLoad( ()=> {
				this.setState({
					gmap_api_loaded: true
				});

				if (this.props.onLoaded) {
					this.props.onLoaded();
				}
			});
		});
	}

	handleChange(address) {
    this.setState({ address });
  };

  handleSelect(address) {

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          latLng: latLng
        })
      })
      .catch(error => console.error('Error', error));
    this.setState({ address })
  };
  onStartOpenChange(startOpen) {
    this.setState({
      startOpen,
    });
  }

  onEndOpenChange(endOpen) {
    this.setState({
      endOpen,
    });
  }

  onStartChange(value) {
    this.setState({
      startValue: value[0],
      startOpen: false,
      endOpen: true,
    });
  }

  onEndChange(value) {
    this.setState({
      endValue: value[1],
    });
	}
	
  disabledStartDate(endValue) {
    if (!endValue) {
      return false;
    }
    const startValue = this.state.startValue;
    if (!startValue) {
      return false;
    }
    return endValue.diff(startValue, 'days') < 0;
	}
		
  disableDate(date) {
    let selected_date = date;

    let now = moment();

    let diff_day = now.diff(selected_date, 'days');

    if (diff_day > 0) {
      return true;
    }
    else {
      return false;
    }
  }
	
	render() {
		const state = this.state;
		let search_guest_options = [];
		for (let i = 1; i <= 30; i++) {
			search_guest_options.push(
				i < 30 ? <option value={i} key={i}> {i} Guest </option> : <option value={i} key={i}> {i}+ Guest </option>
			)
		}

		return (
			// <div id="searchbar">
				<div className="searchbar rjsearchbar">
					{	
						this.state.gmap_api_loaded && 
						<form className="simple-search clearfix" method="get" action='/search' id="searchbar-form-main" name="simple-search">
							<div className="saved-search-wrapper searchbar__input-wrapper">
								<PlacesAutocomplete
									value={this.state.address}
									onChange={this.handleChange}
									onSelect={this.handleSelect}
								>
									{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
										<label className="input-placeholder-group searchbar__location">
											<input aria-label="city"
												{...getInputProps({
													placeholder: 'City, State, Property ID',
													className: 'menu-autocomplete-input text-truncate form-inline location input-large input-contrast',
													name: "locations",
													type: "text",
													id: "location",
													autoComplete: "off",
													label: "Image",
													required: true
												})}
												autoFocus
											/>

											<div className="autocomplete-dropdown-container" style={{ position: 'absolute', paddingLeft: '50px', width: '300px'}}>
												{loading && <div>Loading...</div>}
												{suggestions.map(suggestion => {
													const className = suggestion.active
														? 'suggestion-item--active'
														: 'suggestion-item';
													// inline style for demonstration purpose
													const style = suggestion.active
														? { backgroundColor: '#fafafa', cursor: 'pointer', textAlign: 'left', paddingTop: '10px', padding: '10px', borderBottom: 'solid 1px gray' }
														: { backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left', paddingTop: '10px', padding: '10px', borderBottom: 'solid 1px gray' };

													return (
														<div
															{...getSuggestionItemProps(suggestion, {
																className,
																style,
															})}
														>
															<span><i className='fa fa-map-marker'></i>&nbsp;&nbsp;{suggestion.formattedSuggestion.mainText}, <small>{suggestion.formattedSuggestion.secondaryText}</small></span>
														</div>
													);
												})}

												{suggestions.length ? <div className='text-right'><img alt="scale to width" src='https://vignette.wikia.nocookie.net/ichc-channel/images/7/70/Powered_by_google.png/revision/latest/scale-to-width-down/640?cb=20160331203712' width='50%' /></div> : ''}
											</div>
										</label>
									)}
									{/* custom render function */}
								</PlacesAutocomplete>

								<label className="input-placeholder-group searchbar__checkin">
									<Picker
										onOpenChange={this.onStartOpenChange}
										type="start"
										showValue={state.startValue}
										open={this.state.startOpen}
										value={[state.startValue, state.endValue]}
										onChange={this.onStartChange}
										disabledDate={(date) => this.disableDate(date)}
										name='checkin'
										id="checkin" className="checkin text-truncate input-large input-contrast ui-datepicker-target" placeholder="Check In"
									/>
								</label>

								<label className="input-placeholder-group searchbar__checkout">
									<Picker
										onOpenChange={this.onEndOpenChange}
										open={this.state.endOpen}
										type="end"
										showValue={state.endValue}
										disabledDate={this.disabledStartDate}
										value={[state.startValue, state.endValue]}
										onChange={this.onEndChange}
										name='checkout'
										id="checkout" readOnly="readonly" className="checkout input-large text-truncate input-contrast ui-datepicker-target" placeholder="Check Out"
									/>
								</label>

								<label className="searchbar__guests">
									<div className="select select-large">
										<select id="guests" name="guests" aria-label="Guest">
											{search_guest_options}
										</select>
									</div>
								</label>

								<div id="autocomplete-menu-sbea76915" aria-expanded="false" className="menu hide" >
									<div className="menu-section">
									</div>
								</div>
							</div>

							<input type="hidden" name="source" defaultValue="bb" />
							<button id="submit_location" type="submit" className="searchbar__submit btn btn-primary btn-large">Search</button>
						</form>
					}
				</div>
			// </div>
		)
	}
}

export default SearchBar;
