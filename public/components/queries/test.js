//import React from 'react';
//export class Test extends React.Component {
//   render() {
//      return (
//         <div>
//            <h1>Header</h1>
//         </div>
//      );
//   }
//}

import React, { Fragment } from 'react';

import moment from 'moment';

import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCodeBlock,
  EuiCodeEditor,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiPopover,
  EuiSpacer,
  EuiTab,
  EuiTabbedContent,
  EuiTabs,
  EuiText,
  EuiTitle,
  EuiForm,
  EuiFormRow,
  EuiSwitch,
  EuiFieldText,
  EuiDatePicker,
} from '@elastic/eui';

export class Test extends React.Component {
  constructor(props) {
    super(props);

    const { httpClient } = this.props;

    this.state = {
      isFlyoutVisible: false,
      isSwitchChecked: true,
      isPopoverOpen: false,
      startDated: moment()
    };
    this.handleChanged= this.handleChanged.bind(this);

//this.state = {
//      selectedTab: this.tabs[1],
//    };


    this.tabs = [{
      id: 'cobalt',
      name: 'Global Parameters',
      content: (
        <Fragment>
          <EuiSpacer />
	<EuiForm>
		<EuiFormRow
   fullWidth
         	 label="Text field"
          	helpText="I am some friendly help text."
        	>
          <EuiFieldText fullWidth name="first" />
        </EuiFormRow>

	<EuiFormRow label="Query" fullWidth>
		<EuiCodeEditor
        mode="javascript"
        theme="github"
        width="100%"
        value={this.state.value}
        onChange={this.handleTextChange}
        setOptions={{
          fontSize: '14px',
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
        }}
        onBlur={() => { console.log('blur'); }} // eslint-disable-line no-console
      />
  	</EuiFormRow>

	</EuiForm>
        </Fragment>
      ),
    }, {
      id: 'snor',
      name: 'Validate',
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiTitle><h3>Cobalt</h3></EuiTitle>
          <EuiText>
            SnorCobalt is a chemical element with symbol Co and atomic number 27. Like nickel, cobalt is
            found in the Earth&rsquo;s crust only in chemically combined form, save for small deposits found
            in alloys of natural meteoric iron. The free element, produced by reductive smelting, is a hard,
            lustrous, silver-gray metal.
          </EuiText>
        </Fragment>
      ),
    }];

	this.state = {
		selectedTab: this.tabs[0],
	};

    this.closeFlyout = this.closeFlyout.bind(this);
    this.showFlyout = this.showFlyout.bind(this);
  }

  handleChanged(date) {
    console.log("Changing date: " + date);
    this.setState({
      startDated: date
    });
  };

  onSwitchChange = () => {
    this.setState({
      isSwitchChecked: !this.state.isSwitchChecked,
    });
  }

  closeFlyout() {
    this.setState({ isFlyoutVisible: false });
  }

  showFlyout() {
    this.setState({ isFlyoutVisible: true });
  }

  closePopover = () => {
    this.setState({ isPopoverOpen: false });
  }

  togglePopover = () => {
    this.setState(({ isPopoverOpen }) => ({ isPopoverOpen: !isPopoverOpen }));
  }

  onTabClick = (selectedTab) => {
	console.log(selectedTab);
	const selectedTabIndex = this.tabs.indexOf(selectedTab);
	console.log(selectedTabIndex);  

	this.setState({
      selectedTab: this.tabs[selectedTabIndex],
    });
  	//this.setState({ selectedTab });
  };

  saveQuery = (button) => {
    //console.log({button});
        
        this.setState({
        btnSave: "Loading",
        btnSaveLoading: true,
        jsCode: this.state.value
    });
   
   //checkedChange = (e) => {
   // this.setState({
   //   checked: e.target.checked,
   // });
   //};
   
   var data = { 
        params: {
                "timestamp": moment(),
                "updated_at": moment(),
                "name": "test" + moment(),
                "query": "{\r\n  \"query\":{\r\n    \"match_all\": {}\r\n  }\r\n}",
                "active": true,
                "scheduled": true
        }
   };
   var config = {};
    
    this.props.httpClient.post("../api/jag_testar_ett_plugin/queries2", data ).then((resp) => {
      //this.setState({ time: resp.data.time });
      //this.setState([ rra: resp.data.resp.hits.hits ]);
      //  this.items = resp.data.resp.hits.hits;
      //this.setStastore = resp;
      //this.setState({rr: resp.data.resp.hits.total })
        console.log("---");
        console.log(resp);
        this.setState({
          btnSave: "Save",
          btnSaveLoading: false,
	  isFlyoutVisible: false
        });
        
        }).catch((e) => {
        this.setState({
        btnSave: "Error",
        btnSaveLoading: false,
	isFlyoutVisible: true
    });         
                console.log(e);
        });
  
  };


  render() {

    const htmlCode = `<!--I'm an example of HTML-->
<div>
  asdf
</div>
`;

    let flyout;

    if (this.state.isFlyoutVisible) {
      flyout = (
        <EuiFlyout
          onClose={this.closeFlyout}
          hideCloseButton
          aria-labelledby="flyoutComplicatedTitle"
        >
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h1 id="flyoutComplicatedTitle">
                Create Query
              </h1>
            </EuiTitle>
            <EuiSpacer size="s" />
            <EuiText color="subdued">
              <p>Put navigation items in the header, and cross tab actions in a footer.</p>
            </EuiText>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>

	<EuiTabbedContent
          tabs={this.tabs}
          selectedTab={this.state.selectedTab}
          onTabClick={this.onTabClick}
        /> 

	<EuiSpacer />

            <EuiCodeBlock language="html">
              {htmlCode}
            </EuiCodeBlock>
          </EuiFlyoutBody>
          <EuiFlyoutFooter>
            <EuiFlexGroup justifyContent="spaceBetween">
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  iconType="cross"
                  onClick={this.closeFlyout}
                  flush="left"
                >
                  Close
                </EuiButtonEmpty>
              </EuiFlexItem>
		<EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  iconType="cross"
                  onClick={this.closeFlyout}
                  flush="left"
                >
                  Close
                </EuiButtonEmpty>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton
                  onClick={this.saveQuery}
                  fill
                >
                  Save
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
        </EuiFlyout>
      );
    }

    return (
      <div>
        <EuiButton onClick={this.showFlyout}>
          Show Flyout
        </EuiButton>

        {flyout}
      </div>
    );
  }
}
