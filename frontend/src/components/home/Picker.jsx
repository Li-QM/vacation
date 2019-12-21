import React from 'react'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import DatePicker from 'rc-calendar/lib/Picker';
import enUS from 'rc-calendar/lib/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import 'rc-calendar/assets/index.css';

const format = 'MM-DD-YYYY';
const fullFormat = 'MM-DD-YYYY';

const now = moment();
now.locale('en-gb').utcOffset(0);

class Picker extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			hoverValue: [],
			latLng: { lat: 0, lng: 0 }
		};
		this.onHoverChange = this.onHoverChange.bind(this)
	}

	onHoverChange(hoverValue) {
		this.setState({ hoverValue });
	}

	render() {
		const props = this.props;
		const { showValue } = props;
		const calendar = (
			<RangeCalendar
				hoverValue={this.state.hoverValue}
				onHoverChange={this.onHoverChange}
				type={this.props.type}
				locale={enUS}
				defaultValue={now}
				format={format}
				onChange={props.onChange}
				disabledDate={props.disabledDate}
			/>);
		return (
			<DatePicker
				open={this.props.open}
				onOpenChange={this.props.onOpenChange}
				calendar={calendar}
				minDate={moment()}
				value={props.value}
			>
				{
					() => {
						return (
							<input
								className={props.className}
								placeholder={props.placeholder}
								name={props.name}
								value={(showValue && showValue.format(fullFormat)) || ''}
								aria-label="Date"
								readOnly
							/>
						);
					}
				}
			</DatePicker>);
    }
	}
	
	export default Picker;