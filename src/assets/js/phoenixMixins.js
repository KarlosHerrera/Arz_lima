// phoenixMixins.js
// Se puede extender (global/local) todas las propiedades de un componente


// export const phoenixMixins = {
export const pMixins = {
    // data: function(){ 
    //     return {
    //         roleView: false
    //     }
    // },
    methods: {
        // metodo1: function(){
        //     console.log(metodo1());

        // },
        userRole: function(){
            console.log('mixin.userRole()');
            // // console.dir(self);
            // if( !id ) {console.log('Drowndown Id'); return false;} 
            // let ele = document.getElementById(id);
            // if( !ele ) {console.log('Not found drowndown'); return false;}
            // console.dir(ele); 
            // ele.classList.toggle('show');
            //ele.firstChild.toggle('show');
            this.roleView = !this.roleView;
            if( this.roleView ) {
                // this.disableElement('main', true);
                console.log('$store.state.UserName:', this.$store.state.User_Name);
                // let listOptionsPerfil = [{dsc: 'SignOut', action: '/login'}, {dsc: 'Perfil', action: '/customers'}, {dsc: 'Users', action: '/users'}, {dsc: 'Exit', action: '/exit'}];
                // this.listOptionsPerfil = listOptionsPerfil;

            }

            // return listOptionsPerfil;

        },
        userOption: function(){
            console.log('mixin.userOption()');
            this.optionsView = !this.optionsView;
            if ( this.optionsView) {

                // let listOptionsUser = [{dsc: 'Print', action: '/home'}, {dsc: 'To Pdf', action: '/customers'}, {dsc: 'Migrar', action: '/users'}, {dsc: 'Salir', action: '/exit'}];
                // this.listOptionsUser = listOptionsUser;

            }
            // return listOptionsUser;
        },
        actionRole: function(index){
            console.log(`mixin.actionRole( ${index} )`);
            let action = this.listOptionsPerfil[index].action;
            console.log(this.listOptionsPerfil);
            console.log('ruta = ', action);
            this.$router.push(action)
            .catch(function(){
                console.log('Duplicando ruta...!')
            });

            this.roleView = false;
        },
        actionOption: function(index){
            console.log(`mixin.actionOption( ${index} )`);
            let action = this.listOptionsUser[index].action;
            console.log(this.listOptionsUser);
            console.log('ruta = ', action);
            this.$router.push(action)
            .catch(function(){
                console.log('Duplicando ruta...!')
            });

            this.optionsView = false;
        },

        menuUser: function(){


            
        }
    }

}
// Video: YouTube: 14. Mixins: