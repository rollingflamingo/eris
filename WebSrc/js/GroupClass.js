import './PersonClass';
export default class GroupClass {
    constructor(){
        this.items = [];
        this.stats = {
            m : 0,
            language : {
                /*
                it : 0.2,
                de : 0.3,
                ...
                */
            },
            localCenter :{
                /*
                Genova : 0.1,
                Roma: 0.2
                ...
                */
            }
        }
    }

    clone(otherGroup){
        // copy items
        for(let i = 0; i< otherGroup.items.length; i++){
            this.add(otherGroup.items[i]);
        }
    }

    // higherStats() {
    //     let max = 0, tmp;
    //     for(let stat in this.stats){
    //         if(this.stats[stat]>max) tmp = this.stats[stat];
    //     }
    // }

    add(person){
        this.items.push(person);

        // aggiorno le statistiche esistenti
        this.updateStats();

        // aggiungo, se non esistente, la statistica della lingua
        if(!this.stats.language.hasOwnProperty(person.language)){
            this.stats.language[person.language] = 1/this.items.length;
        }


        // aggiungo la statistica del centro locale
        if(!this.stats.localCenter.hasOwnProperty(person.localCenter)){
            this.stats.localCenter[person.localCenter] = 1/this.items.length;
        }
    }

    remove(person){
        for(let i in items){
            if(items[i].equals(person)) this.items.splice(i, 1);
        }
    }

    remove_at(i){
        return this.items.splice(i, 1)[0];
    }

    massive_add(persons){
        for(let i = 0; i<persons.length; i++)
            this.add(persons[i]);
    }

    mostSpokenLanguage(){
        return this.higher('language');
    }

    lessSpokenLanguage(){
        return this.lower('language');
    }

    mostAttendedCenter(){
        return this.higher('localCenter')
    }

    lessAttendedCenter(){
        return this.lower('localCenter');
    }

    higher(prop){
        let tmp = [], max = 0;
        for(let l in this.stats[prop]){
            if(this.stats[prop][l]>max){
                if(tmp.length > 0) tmp = [];
                tmp.push(l);
                max = this.stats[prop][l];
            } else if(this.stats[prop][l]===max){
                tmp.push(l);
            }
        }
        return tmp;
    }

    lower(prop){
        let tmp = [], min = 1;
        for(let l in this.stats[prop]){
            if(this.stats[prop][l]<min){
                if(tmp.length > 0) tmp = [];
                tmp.push(l);
                min = this.stats[prop][l];
            } else if(this.stats[prop][l]===min){
                tmp.push(l);
            }
        }
        return tmp;
    }

    updatePercentage(statname, flag){
        let tmp = 0;
        for(let i = 0; i<this.items.length; i++){
            if(this.items[i][statname] === flag) tmp++;
        }
        this.stats[statname][flag] = tmp/this.items.length;
    }

    top(){
        let result = this.items.shift();
        this.updateStats();
        return result;
    }

    personSpeaking(lang){
        let tmp = [];
        for(let j = 0; j<lang.length; j++) {
            for (let i = 0; i < this.items.length; i++) {
                // console.log('checking: '+this.items[i]);
                if (this.items[i].language === lang[j]) {
                    // in questo modo tutte le entrate che rientrano nel filtro vengono eliminate, se volessi tenerle basterebbe pushare senza fare splice... ma a quel punto non so se funzionerebbe(?)
                    tmp.push(this.items[i]);
                    this.items.splice(i--, 1);
                    this.updateStats();
                }
            }
        }
        return tmp;
    }

    personAttending(center){
        let tmp = [];
        for(let j = 0; j<center.length; j++) {
            for (let i = 0; i < this.items.length; i++) {
                // console.log('checking: '+this.items[i]);
                if (this.items[i].localCenter === center[j]) {
                    // console.log(`adding ${this.items[i].name} ${this.items[i].surname} to aggregation`);
                    tmp.push(this.items[i]);
                    this.items.splice(i--, 1);
                    this.updateStats();
                }
            }
        }
        return tmp;
    }

    updateStats(){
        for (let statnames in this.stats){
            if(typeof this.stats[statnames] === 'object'){
                for(let prop in this.stats[statnames]){
                    this.updatePercentage(statnames, prop);
                }
            }
            else{
                // caso m:
                let tmp = 0;
                for(let i = 0; i<this.items.length; i++){
                    if(this.items[i].sex === 'M') tmp++;
                }
                this.stats.m = tmp/this.items.length;
            }

        }
    }

    toString(){
        let res = "";
        for(let i = 0; i<this.items.length; i++) res += this.items[i].toString();
        for(let i in this.stats.language) res += `\n\t${i}: ${this.stats.language[i]}`;
        for(let i in this.stats.localCenter) res += `\n\t${i}: ${this.stats.localCenter[i]}`;
        return res;
    }

    groupStats(index){
        // <button type="button" class="btn btn-lg btn-danger" >Click to toggle popover</button>
        let components = "", langs = "", lc ="";
        for(let i = 0; i < this.items.length; i++)
            components+=`${this.items[i].name} ${this.items[i].surname}${i===this.items.length-1?"":", "}`;
        let langSet = Object.keys(this.stats.language);
        for(let i = 0; i < langSet.length; i++)
            langs+=`${langSet[i]}${i===langSet.length-1?"":", "}`;
        let lcSet = Object.keys(this.stats.localCenter);
        for(let i = 0; i < lcSet.length; i++)
            lc+=`${lcSet[i]}${i===lcSet.length-1?"":", "}`;
        return `<tr>
                    <td>${index+1}</td>
                    <td data-toggle="popover"  data-placement="right" data-trigger="hover" data-content="${components}" title="Componenti" data-html="true" class="">${this.items.length}</td>
                    <td>${this.stats.m.toFixed(2)}</td>
                    <td data-toggle="popover"  data-placement="right" data-trigger="hover" data-content="${langs}" title="Lingue" data-html="true" class="">${langSet.length}</td>
                    <td data-toggle="popover"  data-placement="right" data-trigger="hover" data-content="${lc}" title="Centri Locali" data-html="true" class="">${lcSet.length}</td>
                    <td>
                        <button class="bg-transparent border-0 text-custom print mx-3 print-button" data-target="${index}">
                            <span class="fa-stack">
                                <i class="fas fa-print fa-stack-1x"></i>
                                <i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
                            </span>
                        </button>
                    </td>
                </tr>`;
    }
}