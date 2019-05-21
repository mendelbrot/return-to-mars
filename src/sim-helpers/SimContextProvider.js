import React from 'react';
import SimContext from './SimContext';

class SimContextProvider extends React.Component {
    state = {
        hello: 'hello Context!',
    };

    render() {
        return (
            <SimContext.Provider
                value={{
                    hello: this.state.hello,
                }}
            >
                {this.props.children}
            </SimContext.Provider>
        );
    }
}

export default SimContextProvider;