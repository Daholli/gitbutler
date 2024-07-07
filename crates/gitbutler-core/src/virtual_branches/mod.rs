pub mod branch;
pub use branch::{Branch, BranchId};
pub mod target;

mod state;
pub use state::VirtualBranches as VirtualBranchesState;
pub use state::VirtualBranchesAccess;
pub use state::VirtualBranchesHandle;

mod author;
pub use author::Author;

use lazy_static::lazy_static;
lazy_static! {
    pub static ref GITBUTLER_INTEGRATION_REFERENCE: crate::git::LocalRefname =
        crate::git::LocalRefname::new("gitbutler/integration", None);
}

pub const GITBUTLER_INTEGRATION_COMMIT_AUTHOR_NAME: &str = "GitButler";
pub const GITBUTLER_INTEGRATION_COMMIT_AUTHOR_EMAIL: &str = "gitbutler@gitbutler.com";
