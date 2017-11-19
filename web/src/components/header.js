import { Component } from 'preact'
import { route } from 'preact-router'
import Toolbar from 'preact-material-components/Toolbar'
import Drawer from 'preact-material-components/Drawer'
import List from 'preact-material-components/List'

export default class Header extends Component {
    closeDrawer() {
        this.drawer.MDComponent.open = false
    }

    openDrawer() {
        return () => (this.drawer.MDComponent.open = true)
    }

    drawerRef() {
        return drawer => (this.drawer = drawer)
    }

    dialogRef() {
        return dialog => (this.dialog = dialog)
    }

    linkTo() {
        return path => () => {
            route(path)
            this.closeDrawer()
        }
    }

    render() {
        return (
            <div>
                <Toolbar className="toolbar">
                    <Toolbar.Row>
                        <Toolbar.Section align-start>
                            <Toolbar.Icon menu onClick={this.openDrawer}>
                                menu
                            </Toolbar.Icon>
                            <Toolbar.Title>Preact app</Toolbar.Title>
                        </Toolbar.Section>
                    </Toolbar.Row>
                </Toolbar>
                <Drawer.TemporaryDrawer ref={this.drawerRef}>
                    <Drawer.TemporaryDrawerContent>
                        <List>
                            <List.LinkItem>
                                <List.ItemIcon>home</List.ItemIcon>
                                Home
                            </List.LinkItem>
                        </List>
                    </Drawer.TemporaryDrawerContent>
                </Drawer.TemporaryDrawer>
            </div>
        )
    }
}
