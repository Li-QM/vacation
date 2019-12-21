import React, {lazy, Suspense} from 'react'
import 'assets/styles/home/searchbar.scss';

const SearchBar = lazy(() => import('./SearchBar'));

class SearchBarWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			is_loading: false
		};

		this.loadComponent = this.loadComponent.bind(this);
	}

	loadComponent() {
		this.setState({is_loading: true});
	}

	render() {
		const alterComponent = (
				<div className="searchbar rjsearchbar">
					<form className="simple-search clearfix" method="get" action="/search" name="simple-search">
						<div className="saved-search-wrapper searchbar__input-wrapper">

							<label className="input-placeholder-group searchbar__location">
								<input aria-label="city" type="text" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="owned_listbox" placeholder="City, State, Property ID" className="menu-autocomplete-input text-truncate form-inline location input-large input-contrast" name="locations" id="location" label="Image" onClick={this.loadComponent} required/>
							</label>
							
							<label className="input-placeholder-group searchbar__checkin">
								<input className="checkin text-truncate input-large input-contrast ui-datepicker-target" placeholder="Check In" name="checkin" aria-label="Date" onClick={this.loadComponent}/>
							</label>
							
							<label className="input-placeholder-group searchbar__checkout">
								<input className="checkout input-large text-truncate input-contrast ui-datepicker-target" placeholder="Check Out" name="checkout" aria-label="Date" onClick={this.loadComponent}/>
							</label>
							
							<label className="searchbar__guests">
								<div className="select select-large">
									<select id="guests" name="guests" aria-label="Guest" onClick={this.loadComponent}>
										<option value="1"> 1 Guest </option><option value="2"> 2 Guest </option><option value="3"> 3 Guest </option><option value="4"> 4 Guest </option><option value="5"> 5 Guest </option><option value="6"> 6 Guest </option><option value="7"> 7 Guest </option><option value="8"> 8 Guest </option><option value="9"> 9 Guest </option><option value="10"> 10 Guest </option><option value="11"> 11 Guest </option><option value="12"> 12 Guest </option><option value="13"> 13 Guest </option><option value="14"> 14 Guest </option><option value="15"> 15 Guest </option><option value="16"> 16 Guest </option><option value="17"> 17 Guest </option><option value="18"> 18 Guest </option><option value="19"> 19 Guest </option><option value="20"> 20 Guest </option><option value="21"> 21 Guest </option><option value="22"> 22 Guest </option><option value="23"> 23 Guest </option><option value="24"> 24 Guest </option><option value="25"> 25 Guest </option><option value="26"> 26 Guest </option><option value="27"> 27 Guest </option><option value="28"> 28 Guest </option><option value="29"> 29 Guest </option><option value="30"> 30+ Guest </option>
									</select>
								</div>
							</label>
						</div>
						<button id="submit_location" type="submit" className="searchbar__submit btn btn-primary btn-large">Search</button>
					</form>
				</div>
		);

		const is_placeholder = this.props.is_placeholder;
		const is_placeholder_visible = this.props.is_placeholder_visible;
		return (
			
			<div id="searchbar">
			{
				is_placeholder ?
					(is_placeholder_visible ? alterComponent : '')
					:
					(this.state.is_loading ? <Suspense fallback={<div></div>}><SearchBar onLoaded={this.props.onLoaded}/></Suspense> : alterComponent)
			}
			</div>
		)
	}
}

export default SearchBarWrapper;
