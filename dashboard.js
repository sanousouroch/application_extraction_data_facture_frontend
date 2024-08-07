<div class="col-9 mt-2 offset-2">
                <div class="row">
                    <div class="col-md-3">
                      <div class="panel panel-default text-center">
                        <div class="panel-heading">
                          <h6 class="panel-title">Nombre d'Utilisateurs</h6>
                        </div>
                        <div class="panel-body">
                          <img src="assets/images/images_users.jpg" alt="Users" class="img-responsive center-block">
                          <h2>{{ statistiques.userItemCount }}</h2>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="panel panel-default text-center">
                        <div class="panel-heading">
                          <h6 class="panel-title">Nombre de Factures</h6>
                        </div>
                        <div class="panel-body">
                          <img src="assets/images/images_factures.png" alt="Invoices" class="img-responsive center-block">
                          <h2>{{ statistiques.factureItemCount }}</h2>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      
                       <div class="row">
                        <div class="col-12">
                          <canvas id="myChart"></canvas>
                        </div>
                       </div>
                      
                    </div>
                    
                  </div>
                 
                 
              </div>