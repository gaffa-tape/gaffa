var Gaffa = require('gaffa'),
    behaviourType = 'notification';

function Notification(){}
Notification = Gaffa.createSpec(Notification, Gaffa.Behaviour);
Notification.prototype.type = behaviourType;
Notification.prototype.notification = new Gaffa.Property();
Notification.prototype.bind = function(){

    var behaviour = this;

    this.gaffa.notifications.add(
        this.notification.value,
        function(){
            behaviour.triggerActions('notification');
        }
    );
};

module.exports = Notification;