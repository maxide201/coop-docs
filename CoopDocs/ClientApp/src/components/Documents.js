import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { MyDocuments } from './MyDocuments';
import { SharedDocuments } from './SharedDocuments';

export class Documents extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            
        <Tabs>
            <TabList>
                <Tab>Мои документы</Tab>
                <Tab>Доступные документы</Tab>
            </TabList>

            <TabPanel>
                <MyDocuments />
            </TabPanel>
            <TabPanel>
                <SharedDocuments />
            </TabPanel>
        </Tabs>
      </div>
    );
  }
}
