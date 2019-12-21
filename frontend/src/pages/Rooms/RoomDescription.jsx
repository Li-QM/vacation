import React from 'react';
import { Link } from 'react-router-dom';
import LanguageModal from 'react-awesome-modal';

import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

import Content from 'components/rooms/description/content/Content';
import Language from 'components/rooms/description/language/Language';
import Formcontent from 'components/rooms/description/formcontent/Formcontent';
import Formtitle from 'components/rooms/description/formtitle/Formtitle';
import Savebutton from 'components/rooms/description/savebutton/Savebutton';

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/room_description.scss';

class RoomDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable_rerender: true,
      page_data: {
        result: {}
      },
      lang_data: [],
      lang_lists: [],
      current_lang: "en",
      visible_lang_modal: false,
      selected_lang_to_add: "",
      editing_description: {},
      post_data: {
        name: "",
        summary: "",
        description: {}
      }
    };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSummary = this.handleChangeSummary.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.openAddLanguageModal = this.openAddLanguageModal.bind(this);
    this.closeLangModal = this.closeLangModal.bind(this);
    this.selectLanguageToAdd = this.selectLanguageToAdd.bind(this);
    this.handleAddLanguage = this.handleAddLanguage.bind(this);
    this.handleUpdateRoomSummary = this.handleUpdateRoomSummary.bind(this);
    this.removeLanguage = this.removeLanguage.bind(this);
    this.handleDescriptionLanguage = this.handleDescriptionLanguage.bind(this);
    this.handleUpdateRoomDescription = this.handleUpdateRoomDescription.bind(this);
  }
  componentDidMount() {
    this.handleDescriptionLanguage();
    
    roomsService.getAllLanguages(this.props.match.params.room_id).then(res => {
      if (res) {
        this.setState({ lang_lists: res });
      } else {
        alertService.showError('Get all languages');
      }
    });

    roomsService.getRoomDescription(this.props.match.params.room_id).then(res => {
      if (res) {
        let post_data = {};
        post_data.name = res.result.name;
        post_data.summary = res.result.summary;
        post_data.description = res.result.room_description;
        this.setState({
          page_data: res,
          post_data: post_data
        });
        
        console.log('Description res => ', res);
      } else {
        alertService.showError('Get Room Description');
      }
    });
  }
  shouldComponentUpdate(nextProps, nextState) { 
    if (nextState.enable_rerender === false) { 
      return false;
    }
    return true;
  }
  // componentWillUnmount() {
  //   this.handleUpdateRoomDescription();
  //   this.handleUpdateRoomSummary();
  // }
  handleChangeTitle(e) {
    let post_data = this.state.post_data;
    post_data.name = e.target.value;
    
    if (this.state.current_lang !== "en") {
      let lang_data = this.state.lang_data;
      let lang_index = this.state.lang_data.findIndex(language => {
        return language.language.value === this.state.current_lang;
      });

      lang_data[lang_index].name = e.target.value;
    
      this.setState({
        lang_data: lang_data,
        post_data: post_data,
        enable_rerender: true
      });
    } else {
      let page_data = this.state.page_data;
      if (e.target.value.length <= 100) {
        page_data.result.name = e.target.value;
        this.setState({
          page_data: page_data,
          post_data: post_data,
          enable_rerender: true
        });
      }
    }

    this.handleUpdateRoomSummary();
  }
  handleDescriptionChange(name, value) {
    console.log('description => ', name, value)
    let post_data = this.state.post_data;
    post_data.description = {};
    post_data.description[name] = value;

    if (this.state.current_lang !== "en") {
      let lang_data = this.state.lang_data;
      let _self = this;
      let lang_index = this.state.lang_data.findIndex(language => {
        return language.language.value === _self.state.current_lang;
      });
      lang_data[lang_index][name] = value;

      this.setState({
        lang_data: lang_data,
        post_data: post_data,
        enable_rerender: false
      });
    } else {
      let page_data = this.state.page_data;
      page_data.result.room_description[name] = value;

      this.setState({
        page_data: page_data,
        post_data: post_data,
        enable_rerender: false
      });
    }

    this.handleUpdateRoomDescription();
  }
  handleUpdateRoomDescription() {
    let req = {
      current_tab: this.state.current_lang,
      data: JSON.stringify(this.state.post_data.description)
    };

    roomsService.updateRoomDescription(this.props.match.params.room_id, req).then(res => {
      if (res && res.success==='true') {
          this.props.onUpdateSidebar();
      } else {
        // alertService.showError('Update Room Description');
      }
    });
  }
  handleUpdateRoomSummary() {
    let req = {
      current_tab: this.state.current_lang,
      data: JSON.stringify({
        name: this.state.post_data.name,
        summary: this.state.post_data.summary
      })
    };
    roomsService.updateRoomPropertySummary(this.props.match.params.room_id, req).then(res => {
      if (res && res.success==='true') {
        this.props.onUpdateSidebar();
      } else {
        // alertService.showError('Update Room Property Summary');
      }
    });
  }
  handleChangeLanguage(Lang) {
    let req = {
      current_tab: this.state.current_lang,
      data: JSON.stringify({
        name: this.state.post_data.name,
        summary: this.state.post_data.summary
      })
    };
    roomsService.updateRoomPropertySummary(this.props.match.params.room_id, req).then(res => {
      if (res && res.success==='true') {
        let post_data = this.state.post_data;
        if (Lang !== "en") {
          let lang_data = this.state.lang_data;
          let lang_index = this.state.lang_data.findIndex(language => {
            return language.language.value === Lang;
          });
          post_data.summary = lang_data[lang_index].summary;
          post_data.name = lang_data[lang_index].name;
        } else {
          post_data.name = this.state.page_data.result.name;
          post_data.summary = this.state.page_data.result.summary;
        }
        this.setState({
            current_lang: Lang,
            post_data: post_data,
            enable_rerender: true
        });
        this.props.onUpdateSidebar();
      } else {
        alertService.showError('Update Room Property Summary');
      }
    });
  }
  openAddLanguageModal() {
    this.setState({
      visible_lang_modal: true,
      enable_rerender: true
    });
  }
  closeLangModal() {
    this.setState({
      visible_lang_modal: false,
      enable_rerender: true
    });
  }
  selectLanguageToAdd(e) {
    this.setState({
      selected_lang_to_add: e.target.value,
      enable_rerender: true
    });
  }
  handleAddLanguage(e) {
    let req = {
      lan_code: this.state.selected_lang_to_add
    };
    roomsService.addLanguage(this.props.match.params.room_id, req).then(res => {
      if (res) {
        this.setState({
            lang_data: res,
            visible_lang_modal: false,
            selected_lang_to_add: "",
            enable_rerender: true
        });
        this.props.onUpdateSidebar();
      } else {
        alertService.showError('Add Language');
      }
    });
  }
  handleChangeSummary(name, value) {
    console.log('summary => ', name, value)
    let post_data = this.state.post_data;
    post_data.summary = value;

    if (this.state.current_lang !== "en") {
      let lang_data = this.state.lang_data;
      let _self = this;
      let lang_index = this.state.lang_data.findIndex(language => {
        return language.language.value === _self.state.current_lang;
      });
      lang_data[lang_index].summary = value;
      this.setState({
        lang_data: lang_data,
        post_data: post_data,
        enable_rerender: false
      });
    } else {
      let page_data = this.state.page_data;
      page_data.result[name] = value;

      this.setState({
        page_data: page_data,
        post_data: post_data,
        enable_rerender: false
      });
      console.log('state => ', this.state)
    }

    this.handleUpdateRoomSummary();
  }
  handleDescriptionLanguage() {
    roomsService.getDescriptionLanguages(this.props.match.params.room_id).then(res => {
      if (res) {
        this.setState({
            lang_data: res,
            current_lang: "en",
            enable_rerender: true
        });
        this.props.onUpdateSidebar();
      } else {
        alertService.showError('Get Description Languages');
      }
    });
  }
  removeLanguage() {
    let room_id = this.props.match.params.room_id;
    let req = { current_tab: this.state.current_lang };

    roomsService.deleteLanguage(room_id, req).then(res => {
      if (res && res.success==='true') {
        this.handleDescriptionLanguage();
        this.props.onUpdateSidebar();
      } else {
        alertService.showError('Remove Language');
      }
    });
  }
  render() {
    let form_data = {};
    if (this.state.current_lang !== "en") {
      let lang_index = this.state.lang_data.findIndex(language => {
        return language.language.value === this.state.current_lang;
      });

      let lang_description = this.state.lang_data[lang_index];
      form_data.name = lang_description.name;
      form_data.summary = lang_description.summary;

      let room_description = {};
      room_description.access = lang_description.access;
      room_description.house_rules = lang_description.house_rules;
      room_description.interaction = lang_description.interaction;
      room_description.neighborhood_overview =
        lang_description.neighborhood_overview;
      room_description.notes = lang_description.notes;
      room_description.room_id = lang_description.room_id;
      room_description.space = lang_description.space;
      room_description.transit = lang_description.transit;
      form_data.room_description = room_description;
    } else {
      form_data = this.state.page_data.result;
    }

    return (
      <div className="room_description p-0 m-0 ">
        <div className="manage-listing-content-wrapper clearfix">
          <div className="col-md-9" id="js-manage-listing-content">
            <div className="common_listpage">
              <Content roomId={this.props.match.params.room_id} />
              <Language
                removeLanguage={this.removeLanguage}
                handleChangeLanguage={this.handleChangeLanguage}
                openAddLanguageModal={this.openAddLanguageModal}
                lang_data={this.state.lang_data}
                current_lang={this.state.current_lang}
              />
              <LanguageModal
                visible={this.state.visible_lang_modal}
                width="518"
                effect="fadeInUp"
                onClickAway={() => this.closeLangModal()}
              >
                <div className="panel rjbedbathpanel" id="add_language_des">
                  <div className="panel-header">
                    <Link
                      data-behavior="modal-close"
                      className="modal-close"
                      to="#"
                      onClick={() => this.closeLangModal()}
                    />
                    <div className="h4 js-address-nav-heading">Add Language</div>
                  </div>
                  <div className="panel-body">
                    <div className="col-10 col-center text-center">
                      {" "}
                      <i className="icon icon-globe icon-size-3 icon-rausch space-top-3" />
                      <h3>Write a description in another language</h3>
                      <h6>
                        {" "}
                        Vacation.Rentals----- has facility to add your own
                        versions in other languages.{" "}
                      </h6>
                      <div className="row row-table">
                        <div className="col-offset-1 col-7 col-middle">
                          <div className="select select-large select-block">
                            <select
                              id="language-select"
                              onChange={this.selectLanguageToAdd}
                              value={this.state.selected_lang_to_add}
                            >
                              <option disabled value="Choose language...">
                                Choose language...
                              </option>
                              {this.state.lang_lists.map(language => {
                                return (
                                  <option
                                    key={language.value}
                                    value={language.value}
                                  >
                                    {language.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="panel-footer">
                    <div className="col-3 col-middle">
                      <button
                        className="btn btn-large"
                        id="write-description-button"
                        onClick={this.handleAddLanguage}
                        disabled={this.state.selected_lang_to_add ? false : true}
                      >
                        {" "}
                        <i className="icon icon-add float-none" /> Add{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </LanguageModal>
              <div className="description_form col-sm-12">
                <Formtitle />
                <Formcontent
                  data={form_data}
                  handleChangeSummary={this.handleChangeSummary}
                  handleChangeTitle={this.handleChangeTitle}
                  onDescriptionChange={this.handleDescriptionChange}
                />
              </div>
              <Savebutton roomId={this.props.match.params.room_id} />
            </div>
          </div>
          <div className="col-md-3 col-sm-12 listing_desc">
            <div className="manage_listing_left">
              <img
                src={property_help}
                alt="property-help"
                className="col-center"
                width="75"
                height="75"
              />
              <div className="amenities_about">
                <h4>Description</h4>
                <p>
                  Your listing name will be the first thing travelers see when
                  they find your space in search results.
                </p>
                <p>Example: Cozy cottage just off Main Street</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomDescription;