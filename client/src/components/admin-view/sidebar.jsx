import { Fragment } from "react";


function AdminSideBar() {
    return (
        <Fragment>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div className="flex items-center gap-2">
                    <h1>Admin Panel</h1>
                </div>
            </aside>
        </Fragment>
    )
}

export default AdminSideBar