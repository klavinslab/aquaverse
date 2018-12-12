function get_workflow_configs(http) {
  let promises = []
  for ( var i=0; i<config.workflows.length; i++ ) {
    let url = "https://raw.githubusercontent.com" + config.workflows[i] + "/master/config.json";
    promises.push(
      http
      .get(url)
      .then(response => {
        let config = response.data;
        let base = config.github.organization ? config.github.organization : config.github.user;
        config.url = `http://${base}.github.io/${config.github.repo}/`;
        return config;
      })
      .catch(error => { console.log(error); return null; } )
    );
  }
  return Promise.all(promises);
}
