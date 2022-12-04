const scoreBing = require('./scorebing-api');
const pg_data = require("./pg-connection");
const fs = require('fs');

const score = new scoreBing();

module.exports.getMatchDetail = () => {

    let data = []

    score.req(0).then((res) => {
        data = res.rs    
    }).then((res) => {
        let i_max = data.length

        for (i = 0; i < i_max; i++)
        {
            let insert_query = "";

            try{
                if (data[i].status != "NS" && data[i].status != "HT")
                {
                    let insert_columns = ""

                    insert_columns = insert_columns + "INSERT INTO public.team_stats " +
                    "( " +
                    "game_time,  " +
                    "game_date,  " +
                    "game_status_time,  " +
                    "game_hot_value,  " +
                    "league_name,  " +
                    "home_name,  " +
                    "home_attacks,  " +
                    "home_dang_attacks,  " +
                    "home_shots_on_target,  " +
                    "home_shots_off_target,  " +
                    "away_name,  " +
                    "away_attacks,  " +
                    "away_dang_attacks,  " +
                    "away_shots_on_target,  " +
                    "away_shots_off_target,  " +
                    "home_score,  " +
                    "away_score,  " +
                    "home_corners,  " +
                    "away_corners,  " +
                    "home_yellow_cards,  " +
                    "away_yellow_cards,  " +
                    "home_red_cards,  " +
                    "away_red_cards,  " +
                    "home_pre_game_odd,  " +
                    "away_pre_game_odd,  " +
                    "pre_game_corner,  " +
                    "current_home_odd,  " +
                    "current_away_odd,  " +
                    "current_corner_odd,  " +
                    "game_pitch,  " +
                    "game_weather, " +
                    "home_ball_possession, " +
                    "away_ball_possession " +
                    ") ";

                    let insert_values = ""

                    let pitch_id = data[i].events.length -2
                    let weather_id = data[i].events.length -1

                    let home_name = data[i].host.n;
                    let away_name = data[i].guest.n;

                    home_name = home_name.replace("'", "");
                    away_name = away_name.replace("'", "");

                    insert_values = insert_values + "now(), " + 
                                    insert_values + "now(), " + 
                                    insert_values + "'" + data[i].status + "', " + // Game status & time
                                    insert_values + "'" + data[i].hot + "', " + // Score bing hot game
                                    insert_values + "'" + data[i].league.cn + "', " + // Legue name
                                    insert_values + "'" + home_name + "', " + 
                                    insert_values + "'" + data[i].plus.ha + "', " + // home attacks
                                    insert_values + "'" + data[i].plus.hd + "', " +  // home dang attacks
                                    insert_values + "'" + data[i].plus.hso + "', " + // home shots on target
                                    insert_values + "'" + data[i].plus.hsf + "', " + // home shots off target                    
                                    insert_values + "'" + away_name + "', " + 
                                    insert_values + "'" + data[i].plus.ga + "', " + 
                                    insert_values + "'" + data[i].plus.gd + "', " + 
                                    insert_values + "'" + data[i].plus.gso + "', " + 
                                    insert_values + "'" + data[i].plus.gsf + "', " + 
                                    insert_values + "'" + data[i].rd.hg + "', " + // Home score
                                    insert_values + "'" + data[i].rd.gg + "', " +
                                    insert_values + "'" + data[i].rd.hc + "', " + // Home Corners
                                    insert_values + "'" + data[i].rd.gc + "', " +
                                    insert_values + "'" + data[i].rd.hy + "', " + //Home yellow cards
                                    insert_values + "'" + data[i].rd.gy + "', " +
                                    insert_values + "'" + data[i].rd.hr + "', " + // Home red cards
                                    insert_values + "'" + data[i].rd.gr + "', " + 
                                    insert_values + "'" + data[i].sd.f.hrf + "', " + // Pre game home odd
                                    insert_values + "'" + data[i].sd.f.hdx + "', " + // Pre game guest odd
                                    insert_values + "'" + data[i].sd.f.hcb + "', " + // Pre game corner exp
                                    insert_values + "'" + data[i].sd.h.hrf + "', " + // Current home odd
                                    insert_values + "'" + data[i].sd.h.hdx + "', " + // Current guest odd
                                    insert_values + "'" + data[i].sd.h.hcb + "', " + // Current corner exp
                                    insert_values + "'" + data[i].events[pitch_id].c + "', " +
                                    insert_values + "'" + data[i].events[weather_id].c + "', " +
                                    insert_values + "'" + data[i].plus.hqq + "', " +
                                    insert_values + "'" + data[i].plus.gqq + "' ";
                    
                    insert_values = " values (" + insert_values + ")"

                    insert_query = insert_columns + " " + insert_values

                    //console.log(insert_query);
                    pg_data.setData(insert_columns, insert_values);
                    
                }
            }catch(e){
                console.log(insert_query);
                console.log("=====> " + i + " ERROR:" + e)
            }            
        }
        console.log(i_max);
    });
}