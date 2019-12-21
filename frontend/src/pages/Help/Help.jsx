import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

import HelpBanner from './HelpBanner';

import 'assets/styles/pages/help/help.scss';
import { helpService } from 'services/help';
import { alertService } from 'services/alert';

class HelpComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      searchResult: [],
      showSearchResult: false,
      categories: [],
      active_questions: [],
      active_category: 0,
      active_subcgory: 0,
      active_question: 0
    }
    this.handleQueryInput = this.handleQueryInput.bind(this);
    this.HandleSelectQuestion = this.HandleSelectQuestion.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.handleSelectSubcategory = this.handleSelectSubcategory.bind(this);
  }

  componentDidMount() {
    helpService.getHelpListByCategory().then(res => {
      if (res) {
        this.setState({ categories: res });
      } else {
        alertService.showError('Get Help List');
      }
    });
  }

  handleQueryInput(e) {
    e.preventDefault();
    let target = e.target;
    let value = target.value;
    if (value !== '') {
      const query = {
        query: value
      }
      helpService.helpSearch(query).then(res => {
        if (res) {
          this.setState({
            searchResult: res,
            showSearchResult: true
          })
        } else {
          alertService.showError('Help Search');
        }
      })
      this.setState({
        query: value,
      })
    }
    else {
      this.setState({
        query: value,
        showSearchResult: false
      })
    }
  }
  HandleSearch(e) {
    e.preventDefault();
  }
  HandleSelectQuestion(question) {
    let category_index = this.state.categories.findIndex((category) => {
      return category.category_id === question.category_id
    })

    if (category_index !== -1) {
      let subcategory_index = this.state.categories[category_index].subcategories.findIndex((sub_category) => {
        return sub_category.sub_category_id === question.subcategory_id
      })
      if (subcategory_index !== -1) {
        this.setState({
          query: question.question,
          showSearchResult: false,
          active_category: category_index,
          active_subcgory: subcategory_index,
          active_question: question.id
        })
      }
    }
  }
  handleSelectCategory(category_index) {
    this.setState({
      active_category: category_index,
      active_subcgory: 0,
      active_question: 0,
    })
  }
  handleSelectSubcategory(sub_index) {
    this.setState({
      active_subcgory: sub_index,
      active_question: 0,
    })
  }
  handleSubMenu(event, question, index) {
    question.opened = question.opened === undefined ? true : (!question.opened); 
  }
  
  render() {
    let query_search_result = [];
    let query_search_result_panel = <div></div>;
    if (this.state.showSearchResult) {
      this.state.searchResult.forEach((question, index) => {
        if (question.category_id && question.subcategory_id) {
          query_search_result.push(
          <div className="query_search_item" key={index} onClick={() => this.HandleSelectQuestion(question)}>
            {question.question}
          </div>)
        }
      })
      query_search_result_panel = <div className="query_search_panel">{query_search_result}</div>;
    }

    return(
      <main>
        <HelpBanner onChange={this.handleQueryInput} searchResult={query_search_result_panel} value={this.state.query}></HelpBanner>
        <div className="columns-container" id="help-content">
          <div id="columns" className="container">
            <div className="row">
              <div id="left_column" className="column col-xs-12 col-md-3">
                <div id="categories_block_left" className="block">
                  <h2 className="title_block">
                    Categories
                  </h2>
                  <div className="block_content">
                    <ul className="tree dynamized">
                      {
                        this.state.categories.map((category, index) => {
                          return (
                            <li className="last" key={index}>
                              <Link to="#" onClick={() => this.handleSelectCategory(index)}>
                                {category.category_name}
                              </Link>
                              {
                                this.state.active_category === index 
                                ? (<FontAwesomeIcon icon={faMinus} className="unselect-icon"/>)
                                : (<FontAwesomeIcon icon={faPlus} className="select-icon"/>)
                              }
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                </div>
                <section id="informations_block_left_1" className="block informations_block_left">
                  <p className="title_block">
                    SubCategories
                  </p>
                  <div className="block_content list-block">
                    <ul>
                      {
                        this.state.categories[this.state.active_category] ?
                          this.state.categories[this.state.active_category].subcategories.map((subcategory, sub_index) => {
                            return (
                              <li className="first_item" key={sub_index}>
                                <Link
                                  to="#"
                                  onClick={() => this.handleSelectSubcategory(sub_index)}
                                  title="More about Converse">
                                    {
                                      this.state.active_subcgory === sub_index 
                                      ? <FontAwesomeIcon icon={faAngleDoubleRight} className="select-icon"/>
                                      : <FontAwesomeIcon icon={faAngleRight} className="unselect-icon"/>
                                    }
                                  {subcategory.sub_category_name}
                                </Link>
                              </li>
                            );
                          })
                          : null
                      }
                    </ul>
                  </div>
                </section>
              </div>
              <div id="center_column" className="center_column col-xs-12 col-md-9">
                <section id="bonfaq">
                  <div className="panel-group" id="faqAccordion">
                    {
                      this.state.categories[this.state.active_category]
                      && this.state.categories[this.state.active_category].subcategories[this.state.active_subcgory]
                      && this.state.categories[this.state.active_category].subcategories[this.state.active_subcgory].questions.length
                      ? this.state.categories[this.state.active_category].subcategories[this.state.active_subcgory].questions
                        .map((question, index) => {
                          return (
                            <div className="panel panel-default " key={index} onClick={event => this.handleSubMenu(event, question, index)} style={{cursor: 'pointer'}}>
                              <div className={ question.opened ? 'panel-heading accordion-toggle question-toggle' : 'panel-heading accordion-toggle question-toggle collapsed'} 
                                >
                                <h2 className="panel-title">
                                  <Link to="#" className="subtitle"><span>{index + 1}. </span>{question.question}</Link>
                                  {
                                    question.opened 
                                    ? (<FontAwesomeIcon icon={faMinus} className="open-icon"/>)
                                    : (<FontAwesomeIcon icon={faPlus} className="close-icon"/>)
                                  }
                                </h2>
                              </div>
                              <div id={`question${question.id}`} className={ question.opened ? "panel-collapse collapse show" :  "panel-collapse collapse"}>
                                <div className="panel-body" dangerouslySetInnerHTML={{ __html : question.answer }}></div>
                              </div>
                            </div>
                          );
                        })
                        : <div>No Questions</div>
                    }
                  </div>
                </section>
              </div>{/* #center_column */}
            </div>{/* .row */}
          </div>{/* #columns */}
        </div>
      </main>
    );
  }
}

export default HelpComponent;
